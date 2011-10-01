vertex:
    uniform mat4 proj, view;
    uniform float radius;
    uniform vec3 offset;
    attribute vec3 position, normal;
    attribute vec2 texcoord;

    varying vec3 v_normal;
    varying vec2 v_texcoord;

    void main(){
        v_normal = normal;
        v_texcoord = texcoord;
        gl_Position = proj * view * vec4(position*radius+offset, 1.0);
    }

fragment:
    uniform vec3 lightdir;
    uniform mat3 inv_rot;
    uniform mat4 inv_proj;
    uniform vec2 viewport;
    varying vec3 v_normal;
    varying vec2 v_texcoord;
    float ambient = 0.15;
    vec3 color = vec3(128.0/255.0, 202.0/255.0, 244.0/255.0);
    
    vec3 get_world_normal(){
        vec2 frag_coord = gl_FragCoord.xy/viewport;
        frag_coord = (frag_coord-0.5)*2.0;
        vec4 device_normal = vec4(frag_coord, 0.0, 1.0);
        vec3 eye_normal = normalize((inv_proj * device_normal).xyz);
        vec3 world_normal = normalize(inv_rot*eye_normal);
        return world_normal;
    }

    void main(){
        vec3 normal = normalize(v_normal);
        vec3 eye_normal = get_world_normal();
        vec3 specular_normal = reflect(eye_normal, normal);
        float lambert = max(0.0, dot(-v_normal, lightdir));
        float specular = max(0.0, dot(-specular_normal, lightdir));
        gl_FragColor = vec4(mix(color*ambient, color, lambert)+pow(specular, 16.0)*0.3, 1.0);
    }
