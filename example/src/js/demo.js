import Thumbo, { Transfer } from "thumbo";

const TEST_IMAGE_PATH = "../images/content/wallpaper.jpg";

const testImgUrls = [
  {
    url: "https://images.unsplash.com/photo-1635323392268-c92c4a5776f2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=710&q=80",
    fmt: Thumbo.ImageFormat.Jpeg,
  },
  {
    url: "https://images.unsplash.com/photo-1621609764095-b32bbe35cf3a?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1064&q=80",
    fmt: Thumbo.ImageFormat.Jpeg,
  },
  {
    url: "https://www.vectorlogo.zone/logos/rust-lang/rust-lang-icon.svg",
    fmt: Thumbo.ImageFormat.Svg,
  },
  {
    url: "https://images.unsplash.com/photo-1635333638889-e7d59453ac8d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=774&q=80",
    fmt: Thumbo.ImageFormat.Jpeg,
  },
  {
    url: "https://cdn.worldvectorlogo.com/logos/webassembly.svg",
    fmt: Thumbo.ImageFormat.Svg,
  },
  {
    url: "https://images.unsplash.com/photo-1635380673258-3b76cd29a654?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=774&q=80",
    fmt: Thumbo.ImageFormat.Jpeg,
  },
  {
    url: "https://images.unsplash.com/photo-1635178792420-b90837a4e5d0?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=770&q=80",
    fmt: Thumbo.ImageFormat.Jpeg,
  },
  {
    url: "https://images.unsplash.com/photo-1635179210313-6a16eab501fc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=774&q=80",
    fmt: Thumbo.ImageFormat.Jpeg,
  },
  {
    url: "https://images.unsplash.com/photo-1633113092754-523fd2d9a90c?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=774&q=80",
    fmt: Thumbo.ImageFormat.Jpeg,
  },
  {
    url: "https://images.unsplash.com/photo-1620165479836-f68bc54e19d2?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=774&q=80",
    fmt: Thumbo.ImageFormat.Jpeg,
  },
  {
    url: "https://images.unsplash.com/photo-1635367653616-2a7c45339985?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=774&q=80",
    fmt: Thumbo.ImageFormat.Jpeg,
  },
  {
    url: "https://images.unsplash.com/photo-1635235762637-3b09e505a7b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=774&q=80",
    fmt: Thumbo.ImageFormat.Jpeg,
  },
  {
    url: "https://images.unsplash.com/photo-1635346688116-118b69f2f113?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=774&q=80",
    fmt: Thumbo.ImageFormat.Jpeg,
  },
  {
    url: "https://images.unsplash.com/photo-1635403868664-179c789560a7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1087&q=80",
    fmt: Thumbo.ImageFormat.Jpeg,
  },
  {
    url: "https://images.unsplash.com/photo-1635398500586-6d2c1887eeff?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=772&q=80",
    fmt: Thumbo.ImageFormat.Jpeg,
  },
  {
    url: "https://images.unsplash.com/photo-1635394053145-f628e792e4f8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1064&q=80",
    fmt: Thumbo.ImageFormat.Jpeg,
  },
  {
    url: "https://images.unsplash.com/photo-1635323392268-c92c4a5776f2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=710&q=80",
    fmt: Thumbo.ImageFormat.Jpeg,
  },
  ,
];

const t0 = performance.now();

Thumbo.init()
  .then(async () => {
    const t1 = performance.now();
    document.getElementById("start-timer").innerText = `Initialized thumbo: ${(
      (t1 - t0) *
      0.001
    ).toFixed(2)}s`;

    const imgBuffer = await (await fetch(TEST_IMAGE_PATH)).arrayBuffer();

    Thumbo.thumbnail(Transfer(imgBuffer), Thumbo.ImageFormat.Jpeg, 80, 80).then(
      (thumbnailBuffer) => renderThumbnail(thumbnailBuffer)
    );

    testImgUrls.map(({ url, fmt }) =>
      Thumbo.thumbnailFromUrl(url, fmt, 100, 100).then((thumbnailBuffer) =>
        renderThumbnail(thumbnailBuffer)
      )
    );

    Thumbo.completed().then(() => {
      const t2 = performance.now();
      document.getElementById(
        "stop-timer"
      ).innerText = `Generated thumbnails: ${((t2 - t1) * 0.001).toFixed(2)}s`;
    });
  })
  .catch((e) => {
    console.error("Unable to initialized Thumbo:", e);
  });

const renderThumbnail = (imageBuffer) => {
  const img = document.createElement("img");
  img.src = URL.createObjectURL(new Blob([imageBuffer]));
  document.body.appendChild(img);
};
