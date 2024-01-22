import Thumbo, { Transfer } from "thumbo";

const t0  = performance.now();

Thumbo.init()
  .then(async () => {
    const t1 = performance.now();
    document.getElementById("start-timer").innerText = `Initialized Thumbo in ${(
      (t1 - t0) *
      0.001
    ).toFixed(2)}s`;

    const TEST_IMAGE_PATH = "../images/content/wallpaper.jpg";
    const imgBuffer = await (await fetch(TEST_IMAGE_PATH)).arrayBuffer();

    const tJpeg = performance.now();
    Thumbo.thumbnail(Transfer(imgBuffer), Thumbo.ImageFormat.Jpeg, 80, 80).then(
      (thumbnailBuffer) => {
      document.getElementById(
        "stop-timer"
      ).innerHTML += `<li>Wallper.jpeg (6016 × 6016) (5MB) -> Generated thumbnail (80 x 80) (2KB): ${((performance.now() - tJpeg)).toFixed(3)}ms</li>`;
        renderThumbnail(thumbnailBuffer)
      }
    );

    const tImage = performance.now();
    const SVG_LOGO_URL = "https://www.vectorlogo.zone/logos/rust-lang/rust-lang-icon.svg"
    Thumbo.thumbnailFromUrl(SVG_LOGO_URL, Thumbo.ImageFormat.Svg, 100, 100).then((thumbnailBuffer) =>
      {
        document.getElementById(
          "stop-timer"
        ).innerHTML += `<li>Renders the Rust logo (Svg) to a PNG thumbnail in ${((performance.now() - tImage)).toFixed(3)}ms</li>`;
        renderThumbnail(thumbnailBuffer)
      }
    );
  })
  .catch((e) => {
    console.error("Unable to initialized Thumbo:", e);
  });

const renderThumbnail = (imageBuffer) => {
  const img = document.createElement("img");
  img.src = URL.createObjectURL(new Blob([imageBuffer]));
  document.body.appendChild(img);
};
