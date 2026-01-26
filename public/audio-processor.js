class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.port.onmessage = (event) => {
      if (event.data.type === 'send-audio') {
        this.sendAudio(event.data.buffer);
      }
    };
  }

  sendAudio(buffer) {
    // Calculate RMS volume for speaking animation
    let sum = 0;
    for (let i = 0; i < buffer.length; i++) {
      sum += buffer[i] * buffer[i];
    }
    const volume = Math.sqrt(sum / buffer.length);

    // Send volume to main thread
    this.port.postMessage({ type: 'volume', volume });

    // Convert to Int16Array and send
    const l = buffer.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = buffer[i] * 32768;
    }

    // Send audio data to main thread
    this.port.postMessage({
      type: 'audio-data',
      data: int16.buffer.slice(0)
    }, [int16.buffer]);
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (input && input[0]) {
      const buffer = input[0];
      this.sendAudio(buffer);
    }
    return true;
  }
}

registerProcessor('audio-processor', AudioProcessor);