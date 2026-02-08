class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 4096;
    this.buffer = new Float32Array(this.bufferSize);
    this.bufferIndex = 0;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];

    if (input.length > 0) {
      const inputChannel = input[0];

      let sum = 0;
      for (let i = 0; i < inputChannel.length; i++) {
        sum += inputChannel[i] * inputChannel[i];
      }
      const rms = Math.sqrt(sum / inputChannel.length);

      this.port.postMessage({
        type: 'volume',
        volume: rms
      });

      for (let i = 0; i < inputChannel.length; i++) {
        this.buffer[this.bufferIndex++] = inputChannel[i];

        if (this.bufferIndex >= this.bufferSize) {
          this.port.postMessage({
            type: 'audio-data',
            data: this.buffer.slice().buffer
          });

          this.buffer = new Float32Array(this.bufferSize);
          this.bufferIndex = 0;
        }
      }
    }

    return true; 
  }
}

registerProcessor('audio-processor', AudioProcessor);