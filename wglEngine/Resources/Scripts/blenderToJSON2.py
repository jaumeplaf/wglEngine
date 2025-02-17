import bpy
import json
import os
import numpy as np
from bpy.types import Operator, Panel, PropertyGroup
from bpy.props import BoolProperty, StringProperty, PointerProperty

class JsonExportSettings(PropertyGroup):
    export_to_single_file: BoolProperty(
        name="Export to Single File",
        description="Export all selected meshes to a single JSON file",
        default=False
    )
    single_file_name: StringProperty(
        name="Single File Name",
        description="Name of the single JSON file (without extension)",
        default="all_meshes",
        maxlen=255
    )
    export_path: StringProperty(
        name="Export Path",
        description="Path to export JSON files (leave empty for blend file location)",
        default="",
        subtype='DIR_PATH',
        maxlen=1024
    )
    export_vertices: BoolProperty(name="Export Vertices", default=True)
    export_normals: BoolProperty(name="Export Normals", default=True)
    export_indices: BoolProperty(name="Export Indices", default=True)
    export_texcoords1: BoolProperty(name="Export UV Channel 1", default=True)
    export_texcoords2: BoolProperty(name="Export UV Channel 2", default=False)
    export_texcoords3: BoolProperty(name="Export UV Channel 3", default=False)
    export_colors: BoolProperty(name="Export Colors", default=True)


class MESH_OT_export_json(Operator):
    """Export selected meshes to JSON"""
    bl_idname = "mesh.export_json"
    bl_label = "Export JSON"
    bl_options = {'REGISTER', 'UNDO'}

    def export_single_mesh(self, obj, settings):
        if obj.type != 'MESH':
            return None

        mesh = obj.data

        # Check for non-triangulated faces
        for poly in mesh.polygons:
            if len(poly.vertices) != 3:
                self.report({'ERROR'}, f"Object '{obj.name}' contains non-triangulated faces. Please triangulate the mesh first.")
                return None

        data = {}

        # Storage for unique vertex combinations
        vertex_map = {}
        new_vertices = []
        new_normals = []
        new_texcoords = []
        new_colors = []
        new_indices = []

        # Get UV and color layers
        uv_layer = mesh.uv_layers.active.data if mesh.uv_layers and settings.export_texcoords1 else None
        if "colors" not in mesh.color_attributes:
            self.report({'ERROR'}, "Active vertex color attribute must be named 'colors'.")
            return None
        color_layer = mesh.color_attributes["colors"]

        # Process each polygon
        for poly in mesh.polygons:
            if len(poly.vertices) != 3:
                continue

            for loop_idx in poly.loop_indices:
                vert_idx = mesh.loops[loop_idx].vertex_index
                vertex = mesh.vertices[vert_idx]

                # Get UV coordinates
                uv = tuple(uv_layer[loop_idx].uv) if uv_layer else (0, 0)
                
                # Get color or default
                color = tuple(color_layer.data[loop_idx].color) if color_layer else (0, 0, 0, 1)

                # Create unique vertex key
                vertex_key = (
                    tuple(vertex.co),
                    tuple(vertex.normal),
                    uv,
                    color  # Add color to make vertices with different colors unique
                )

                if vertex_key not in vertex_map:
                    vertex_map[vertex_key] = len(new_vertices) // 3
                    new_vertices.extend([vertex.co.x, vertex.co.y, vertex.co.z])
                    new_normals.extend([vertex.normal.x, vertex.normal.y, vertex.normal.z])
                    new_texcoords.extend([uv[0], uv[1]])
                    new_colors.extend(color)

                new_indices.append(vertex_map[vertex_key])

        # Store processed data
        data["vertices"] = new_vertices
        data["normals"] = new_normals
        data["indices"] = new_indices
        data["texcoords1"] = new_texcoords
        data["colors"] = new_colors

        return data

    def check_triangulation(self, obj):
        if obj.type != 'MESH':
            return True
            
        for poly in obj.data.polygons:
            if len(poly.vertices) != 3:
                return False
        return True

    def execute(self, context):
        settings = context.scene.json_export_settings
        selected_objects = [obj for obj in context.selected_objects if obj.type == 'MESH']

        if not selected_objects:
            self.report({'WARNING'}, "No mesh objects selected")
            return {'CANCELLED'}

        # Check all meshes first
        for obj in selected_objects:
            if not self.check_triangulation(obj):
                self.report({'ERROR'}, f"Object '{obj.name}' contains non-triangulated faces. Please triangulate all meshes first.")
                return {'CANCELLED'}

        export_path = bpy.path.abspath(settings.export_path) if settings.export_path.strip() else bpy.path.abspath("//")
        os.makedirs(export_path, exist_ok=True)

        if settings.export_to_single_file:
            # Export to a single file
            single_file_name = settings.single_file_name.strip() or "all_meshes"
            output_file = os.path.join(export_path, f"{single_file_name}.json")
            try:
                with open(output_file, "w") as f:
                    for obj in selected_objects:
                        mesh_data = self.export_single_mesh(obj, settings)
                        if mesh_data:
                            mesh_name = bpy.path.clean_name(obj.name)
                            f.write(f"var {mesh_name} = ")
                            json.dump(mesh_data, f, indent=4)
                            f.write(";\n")
                self.report({'INFO'}, f"Exported all meshes to {output_file}")
                return {'FINISHED'}
            except Exception as e:
                self.report({'ERROR'}, f"Failed to export meshes: {str(e)}")
                return {'CANCELLED'}
        else:
            # Export to separate files
            export_count = 0
            for obj in selected_objects:
                mesh_data = self.export_single_mesh(obj, settings)
                if mesh_data:
                    mesh_name = bpy.path.clean_name(obj.name)
                    output_file = os.path.join(export_path, f"{mesh_name}.json")
                    try:
                        with open(output_file, "w") as f:
                            f.write(f"var {mesh_name} = ")
                            json.dump(mesh_data, f, indent=4)
                        export_count += 1
                    except Exception as e:
                        self.report({'ERROR'}, f"Failed to export {obj.name}: {str(e)}")
            if export_count:
                self.report({'INFO'}, f"Successfully exported {export_count} mesh{'es' if export_count > 1 else ''}")
                return {'FINISHED'}
            else:
                self.report({'WARNING'}, "No meshes were exported")
                return {'CANCELLED'}


class VIEW3D_PT_json_exporter(Panel):
    """Creates a Panel in the Tools sidebar"""
    bl_label = "JSON Mesh Export"
    bl_idname = "VIEW3D_PT_json_exporter"
    bl_space_type = 'VIEW_3D'
    bl_region_type = 'UI'
    bl_category = 'Tool'

    def draw(self, context):
        layout = self.layout
        settings = context.scene.json_export_settings

        layout.prop(settings, "export_to_single_file")
        if settings.export_to_single_file:
            layout.prop(settings, "single_file_name")
        layout.prop(settings, "export_path")

        col = layout.column(align=True)
        col.label(text="Export Options:")
        col.prop(settings, "export_vertices")
        col.prop(settings, "export_normals")
        col.prop(settings, "export_indices")
        col.prop(settings, "export_texcoords1")
        col.prop(settings, "export_texcoords2")
        col.prop(settings, "export_texcoords3")
        col.prop(settings, "export_colors")

        layout.operator("mesh.export_json", text="Export Selected to JSON")

def register():
    bpy.utils.register_class(JsonExportSettings)
    bpy.utils.register_class(MESH_OT_export_json)
    bpy.utils.register_class(VIEW3D_PT_json_exporter)
    bpy.types.Scene.json_export_settings = PointerProperty(type=JsonExportSettings)


def unregister():
    bpy.utils.unregister_class(JsonExportSettings)
    bpy.utils.unregister_class(MESH_OT_export_json)
    bpy.utils.unregister_class(VIEW3D_PT_json_exporter)
    del bpy.types.Scene.json_export_settings


if __name__ == "__main__":
    register()