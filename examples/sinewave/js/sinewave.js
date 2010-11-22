window.addEvent("domready", function() {
    var SineWaveExample = new Class({
        Extends: App,
        Implements: AudioOutput,
        initialize: function(element, options) {
            App.prototype.initialize.apply(this, [element, options]);
            this.initAudio(1);
            this.sineWave = new Oscillator(Oscillator.Sine, 300,
                                           this.numChannels,
                                           this.bufferSize, this.sampleRate);
                                        
        },

        audioRequested: function() {
            this.sineWave.generate();
            return(this.sineWave.signal);
        }
    });

    window.app = new SineWaveExample(document.body);
    window.app.run();
});


