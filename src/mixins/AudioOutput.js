var AudioOutput = new Class({
    initAudioOutput: function(numChannels, bufferSize, sampleRate) {
        this.numChannels = numChannels || 2;
        this.sampleRate = sampleRate || 44100.0;
        this.bufferSize = bufferSize || 32784;

        this.output = new Audio();
        this.overflow = null;
        this.writePosition = 0;

        if (typeof this.output.mozSetup === 'function') {
            this.output.mozSetup(this.numChannels, this.sampleRate);
            this.audioEnabled = true;
        }
        else {
            this.audioEnabled = false;
            // Allow profiling in chrome
            this.output.mozCurrentSampleOffset = function() {
                return 0;
            };
            this.output.mozWriteAudio = function() {
            };
        }
    },

    tickAudioOutput: function() {
        // Check if some data was not written in previous attempts
        var numSamplesWritten;
        if (this.overflow) {
            numSamplesWritten = this.output.mozWriteAudio(this.overflow);
            this.writePosition += numSamplesWritten;
            if (numSamplesWritten < this.overflow.length) {
                // Not all the data was written, saving the tail for writing
                // the next time fillBuffer is called
                this.overflow = this.overflow.slice(numSamplesWritten);
                return;
            }
            tail = null;
        }

        // Check if we need add some data to the audio output.
        var outputPosition = this.output.mozCurrentSampleOffset();
        var samplesNeeded = outputPosition + this.bufferSize -
                            this.writePosition;
        if (samplesNeeded > 0) {
            // Request some sound data from the callback function.
            var buffer = this.audioRequested(Math.floor(samplesNeeded));

            // Writing the data.
            numSamplesWritten = this.output.mozWriteAudio(buffer);
            if (numSamplesWritten < buffer.length) {
                // Not all the data was written, saving the tail.
                this.overflow = buffer.slice(numSamplesWritten);
            }
            this.writePosition += numSamplesWritten;
        }
    },

    // Override me!
    audioRequested: function(samplesNeeded) {
    }
});
