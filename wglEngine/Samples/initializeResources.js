//Initialize camera
const camera01 = new Camera(
    0.1, // Near plane
    5000.0, // Far plane
    [15, 15, 15], // Initial Position
    [0, 15, -1] // Initial Target
);

//Initialize player
const player01 = new Player(
    camera01 //Camera
);

//Initialize scene  
const currentScene = new Scene(
    camera01, //Camera
    player01 //Player
);


//Initialize textures
const t_woodTrim_basecolor = new TextureObject(
    "wglEngine/Resources/Textures/trim_baseColor.png" // Path
);
const t_woodTrim_normal = new TextureObject(
    "wglEngine/Resources/Textures/trim_normal.png" // Path
);
const t_painterly01 = new TextureObject(
    "wglEngine/Resources/Textures/PainterlyTexture01.png" // Path
);
const t_fish01 = new TextureObject(
    "wglEngine/Resources/Textures/FishAtlas01.png" // Path
);


//Initialize Materials. Shaders must be declared in the HTML document and have an ID
const m_flat01 = new Material(
    currentScene, // Scene
    "VS_01", // Vertex Shader ID
    "FS_01", // Fragment Shader ID
    false, //Base color texture
    false, //Normal map texture
    false //Flip V coords
);
m_flat01.setMaterialAttributes(
    [.5, .5, .5], // Ambient
    [0.5, 0.5, 0.5], // Diffuse
    [0.4, 0.4, 0.4], // Specular
    10.0 // Shininess
);

//Initialize Materials. Shaders must be declared in the HTML document and have an ID
const m_flat02 = new Material(
    currentScene, // Scene
    "VS_01", // Vertex Shader ID
    "FS_01", // Fragment Shader ID
    false, //Base color texture
    false, //Normal map texture
    false //Flip V coords
);
m_flat02.setMaterialAttributes(
    [10.0, 10.0, 10.0], // Ambient
    [10.0, 10.0, 10.0], // Diffuse
    [0, 0, 0], // Specular
    1.0 // Shininess
);

//Initialize Materials. Shaders must be declared in the HTML document and have an ID
const m_flat03 = new Material(
    currentScene, // Scene
    "VS_01", // Vertex Shader ID
    "FS_01", // Fragment Shader ID
    false, //Base color texture
    false, //Normal map texture
    false, //Flip V coords
    true //Noise
);
m_flat03.setMaterialAttributes(
    [.5, .5, .5], // Ambient
    [0.5, 0.5, 0.5], // Diffuse
    [0.4, 0.4, 0.4], // Specular
    10.0 // Shininess
);

const m_bounce01 = new Material(
    currentScene, // Scene
    "VS_02_bounce", // Vertex Shader ID
    "FS_01", // Fragment Shader ID
    false, //Base color texture
    false, //Normal map texture
    false //Flip V coords
);
m_flat01.setMaterialAttributes(
    [.2, .2, .2], // Ambient
    [0.4, 0.4, 0.4], // Diffuse
    [0.2, 0.2, 0.2], // Specular
    10.0 // Shininess
);

const m_concrete01 = new Material(
    currentScene, // Scene
    "VS_01", // Vertex Shader ID
    "FS_01", // Fragment Shader ID
    false, //Base color texture
    false, //Normal map texture
    false, //Flip V coords
    true //Noise
    );
m_concrete01.setMaterialAttributes(
    [0.5, 0.5, 0.5], //Ambient
    [0.8, 0.8, 0.8], //Diffuse
    [0.8, 0.8, 0.8], //Specular
    1.0 //Shininess
);
const m_shiny01 = new Material(
    currentScene, // Scene
    "VS_01", // Vertex Shader ID
    "FS_01", // Fragment Shader ID
    false, //Base color texture
    false, //Normal map texture
    false //Flip V coords
    );
m_shiny01.setMaterialAttributes(
    [.5, .5, .5], // Ambient
    [0.6, 0.6, 0.6], // Diffuse
    [0.9, 0.9, 0.9], // Specular
    100.0 // Shininess
);

const m_WoodTrim01 = new Material(
    currentScene, // Scene
    "VS_01", // Vertex Shader ID
    "FS_01", // Fragment Shader ID
    true, //Base color texture
    false, //Normal map texture
    true //Flip V coords
    );
m_WoodTrim01.assignTexture(t_woodTrim_basecolor, 'baseColor');
m_WoodTrim01.setMaterialAttributes(
    [0.6, 0.6, 0.6], // Ambient
    [0.8, 0.8, 0.8], // Diffuse
    [0.4, 0.4, 0.4], // Specular
    1.0 // Shininess
);

const m_ExampleText01 = new Material(
    currentScene, // Scene
    "VS_01", // Vertex Shader ID
    "FS_01", // Fragment Shader ID
    true, //Base color texture
    false, //Normal map texture
    true //Flip V coords
    );
m_ExampleText01.assignTexture(t_painterly01, 'baseColor');
m_ExampleText01.setMaterialAttributes(
    [0.9, 0.9, 0.9], // Ambient
    [0.7, 0.7, 0.7], // Diffuse
    [0.5, 0.5, 0.5], // Specular
    25.0 // Shininess
);

const m_Fish01 = new Material(
    currentScene, // Scene
    "VS_01", // Vertex Shader ID
    "FS_01", // Fragment Shader ID
    true, //Base color texture
    false, //Normal map texture
    true //Flip V coords
    );
m_Fish01.assignTexture(t_fish01, 'baseColor');
m_Fish01.setMaterialAttributes(
    [0.7, 0.7, 0.7], // Ambient
    [0.7, 0.7, 0.7], // Diffuse
    [0.9, 0.9, 0.9], // Specular
    100.0 // Shininess
);


//Initialize MeshObjects
const base_floor = new MeshObject(
    SM_Floor01, //Mesh origin
    m_flat01 //Material
);
const base_plane = new MeshObject(
    SM_Plane, //Mesh origin
    m_flat01 //Material
);
const base_cube = new MeshObject(
    SM_Cube, //Mesh origin
    m_ExampleText01 //Material
);
const base_sphere = new MeshObject(
    SM_Sphere, //Mesh origin
    m_flat03 //Material
);
const base_arrowX = new MeshObject(
    SM_DebugArrow_X, //Mesh origin
    m_flat02 //Material
);
const base_arrowY = new MeshObject(
    SM_DebugArrow_Y, //Mesh origin
    m_flat02 //Material
);
const base_arrowZ = new MeshObject(
    SM_DebugArrow_Z, //Mesh origin
    m_flat02 //Material
);
const base_suzanne = new MeshObject(
    SM_Suzanne, //Mesh origin
    m_bounce01 //Material
);
const base_lightBulb = new MeshObject(
    Lightbulb01, //Mesh origin
    m_flat01 //Material
);
const base_testPolygon = new MeshObject(
    TEST01, //Mesh origin
    m_shiny01 //Material
);

const base_barrel = new MeshObject(
    Barrel01, //Mesh origin
    m_WoodTrim01 //Material
);
const base_barrel2 = new MeshObject(
    Barrel02, //Mesh origin
    m_WoodTrim01 //Material
);

const base_cart01 = new MeshObject(
    Cart01, //Mesh origin
    m_WoodTrim01 //Material
);

const base_shark01A = new MeshObject(
    Shark01A, //Mesh origin
    m_Fish01 //Material
);
const base_shark01B = new MeshObject(
    Shark01B, //Mesh origin
    m_flat01 //Material
);
const base_shark01C = new MeshObject(
    Shark01C, //Mesh origin
    m_Fish01 //Material
);
const base_sardine01A = new MeshObject(
    Sardine01A, //Mesh origin
    m_Fish01 //Material
);
const base_sardine01B = new MeshObject(
    Sardine01B, //Mesh origin
    m_Fish01 //Material
);
const base_sardine01C = new MeshObject(
    Sardine01C, //Mesh origin
    m_Fish01 //Material
);
const base_sardine02A = new MeshObject(
    Sardine02A, //Mesh origin
    m_Fish01 //Material
);
const base_sardine02B = new MeshObject(
    Sardine02B, //Mesh origin
    m_Fish01 //Material
);
const base_sardine02C = new MeshObject(
    Sardine02C, //Mesh origin
    m_Fish01 //Material
);
const base_sardine03A = new MeshObject(
    Sardine03A, //Mesh origin
    m_Fish01 //Material
);
const base_sardine03B = new MeshObject(
    Sardine03B, //Mesh origin
    m_Fish01 //Material
);
const base_sardine03C = new MeshObject(
    Sardine03C, //Mesh origin
    m_Fish01 //Material
);
const base_seaBrim01A = new MeshObject(
    SeaBrim01A, //Mesh origin
    m_Fish01 //Material
);
const base_seaBrim01B = new MeshObject(
    SeaBrim01B, //Mesh origin
    m_Fish01 //Material
);
const base_seaBrim01C = new MeshObject(
    SeaBrim01C, //Mesh origin
    m_Fish01 //Material
);
