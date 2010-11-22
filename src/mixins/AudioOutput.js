var AudioOutput = new Class({
    initAudioOutput: function(numChannels, bufferSize, sampleRate) {
        this.numChannels = numChannels || 2;
        this.bufferSize = bufferSize || 32784;
        this.sampleRate = sampleRate || 44100.0;

        this.output = new Audio();
        this.overflow = null;
        this.writePosition = 0;

        if (typeof this.output.mozSetup === 'function' ) {
            this.output.mozSetup(this.numChannels, this.sampleRate);
            this.fillBuffer.periodical(1000 * bufferSize / sampleRate, this);
        }
    },

    fillBuffer: function() {
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
        var samplesNeeded;
        if (outputPosition == 0) {
            samplesNeeded = this.bufferSize;
        }
        else {
            samplesNeeded = outputPosition + this.bufferSize - this.writePosition;
        }
        if (samplesNeeded > 0) {
            // Request some sound data from the callback function.
            var audioData = this.audioRequested();

            // Writing the data.
            numSamplesWritten = this.output.mozWriteAudio(audioData);
            if (numSamplesWritten < audioData.length) {
                // Not all the data was written, saving the tail.
                this.overflow = audioData.slice(numSamplesWritten);
            }
            this.writePosition += numSamplesWritten;
        }
    },

    // Override me!
    audioRequested: function() {
    }
});
