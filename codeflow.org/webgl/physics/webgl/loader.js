Framework.components.push(function(framework, gl){
    var extre = /\.([^\.]+)$/;

    framework.Loader = Class({
        __init__: function(){
            this.events = new EventManager();
        },
        load: function(data){
            var self = this;
            var count = 0;
            $.each(data, function(name, path){
                count += 1;
                var extension = path.match(extre)[1];

                switch(extension){
                    case 'jpg': case 'png':
                        $('<img>')
                            .attr('src', path)
                            .load(function(){
                                count -= 1;
                                data[name] = new framework.Texture()
                                    .image(this)
                                    .repeat()
                                    .mipmap();
                                if(count == 0){
                                    self.events.dispatch('ready', data);
                                }
                            });
                        break;
                    case 'shader': 
                        $.get(path, function(source){
                            count -= 1;
                            data[name] = new framework.Shader(source);
                            if(count == 0){
                                self.events.dispatch('ready', data);
                            }
                        });
                        break;
                }
            });
            return this;
        },
        ready: function(callback){
            this.events.on('ready', callback);
            return this;
        },
    });
});
