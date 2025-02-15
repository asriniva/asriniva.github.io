  // Track when the script is initially loaded in case it gets reloaded.
  var startTime;
  // Total number of allocations performed.
  var allocCount = 0;
  // Array of ArrayBuffer allocations.
  var allocated = [];

  // Button handlers.
  alloc.onclick = () => {
    allocOnce();
  }
  free.onclick = () => {
    show("Free clicked");
    allocated = [];
    updateStatus();
  }
  update.onclick = () => {
    show("Update clicked");
    updateStatus();
  }
  total.onchange = () => {
    show("Move clicked");
    updateStatus();
    totalnum.value = total.value;
  }


  // Update the current status of the page.
  function updateStatus() {
    const now = new Date();
    lasttime.value = now.toString();
    const elapsed = now - startTime;
    lifePre.textContent = (elapsed / 1000) + " seconds";

    let total = 0;
    for (let i = 0; i < allocated.length; ++i) {
      total += allocated[i].byteLength;
    }
    allocPre.textContent = total + " bytes;  " + allocated.length + " blocks";
  }

  // Allocate and fill a single block.
  function allocOnce() {
    ++allocCount;
    show("Allocate called " + allocCount);
    allocBuffer(blocksize.value * 1024 * 1024);
    updateStatus();
  }

  // Allocate and fill a buffer of a given size.
  function allocBuffer(size) {
    buffer = new ArrayBuffer(size);
    allocated.push(buffer);
    fillBuffer(buffer);
  }

  // Fill a buffer with random data.
  function fillBuffer(buffer) {
    // console.log("Filling " + buffer);
    // Crypto.getRandomValues can generate up to 64KiB at a time.
    const maxBlockSize = 64 * 1024;
    for (let i = 0; i < buffer.byteLength; i += maxBlockSize) {
      const bytesRemaining = buffer.byteLength - i;
      const viewSize = Math.min(bytesRemaining, maxBlockSize);
      const view = new Int8Array(buffer, i, viewSize);
      crypto.getRandomValues(view);
    }
  }

  // Show and log a status line.
  function show(s) {
    console.log(s);
    statusPre.textContent = s;
  }

  // Function that is called once when the script is initially loaded.
  function startup() {
    // Track when the page was initially loaded.
    startTime = new Date();
    show("Startup called " + startTime);
    loadtime.value = startTime.toString();

    // Handle URL params.
    const params = new URLSearchParams(window.location.search);
    if (params.has("blocksize")) {
      blocksize.value = params.get("blocksize");
    }
    if (params.has("alloc")) {
      // Perform allocations.
      for (let i = 0; i < params.get("alloc"); ++i) {
        allocOnce();
      }
    }
  }

  startup();
