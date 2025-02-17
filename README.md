# wglEngine
Basic WebGL2 rendering engine (without GUI for scene composition) using OOP.
Some features: model and texture loading, phong shading, multiple draw modes, custom shaders in the HTML document, small GUI for shading parameters.
![image](https://github.com/user-attachments/assets/1cec292d-d822-4729-8ee3-a4e20a776469)
![image](https://github.com/user-attachments/assets/bec4a0c9-ac32-4f2e-af0d-31e00e103371)

## Controls

### Movement
- **W** - Move Forward  
- **A** - Move Left  
- **S** - Move Backward  
- **D** - Move Right  
- **Space** - Move Up  
- **Q** - Move Down  
- **Shift** - Sprint  
- **Scroll Wheel** - Adjust Speed  

### Look
- Click on the canvas to lock the mouse pointer  
- Move the mouse to look around  
- Press **ESC** to unlock the mouse pointer  

### Rendering
- **1** - Draw mode: Triangles  
- **2** - Draw mode: Lines  
- **3** - Draw mode: Points  
- **4** - Draw mode: Triangles + Wireframe  
- **5** - Draw mode: Triangles + Points  
- **6** - Draw mode: Triangles + Lines + Points  
- **7** - Draw mode: Normal Visualization  


This engine requires a special JSON format to load models, it includes the script "wglEngine/Resources/Scripts/blenderToJSON2.py" to export models from blender.

Use either the Launcher, setup.bat or open baseScene.html in a local server.
Requires python or some other way to start a local server to avoid CORS issues.
