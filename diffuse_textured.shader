vertex:
    uniform mat4 proj, view;
    uniform vec3 offset;
    attribute vec3 position, normal;
    attribute vec2 texcoord;

    varying vec3 v_normal;
    varying vec2 v_texcoord;

    void main(){
        v_normal = normal;
        v_texcoord = texcoord;
        gl_Position = proj * view * vec4(position+offset, 1.0);
    }

fragment:
    uniform sampler2D color;
    uniform vec3 lightdir;
    varying vec3 v_normal;
    varying vec2 v_texcoord;
    float ambient = 0.15;

    void main(){
        float lambert = max(0.0, dot(normalize(v_normal), lightdir));
        vec3 color = texture2D(color, v_texcoord).rgb;
        gl_FragColor = vec4(mix(color*ambient, color, lambert), 1.0);
    }
