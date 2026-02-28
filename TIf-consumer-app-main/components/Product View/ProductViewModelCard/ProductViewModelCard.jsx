import {
  CubeTransparentIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import { Camera, Codesandbox, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

const ProductViewModelCard = ({
  productInfo,
  analyticsOnVariantChanged,
  analyticsOnARView,
  analyticsOnLoad360,
}) => {
  const [showDimensions, setShowDimensions] = useState(true);
  const [showDepth, setShowDepth] = useState(false);
  const [showVariantSelector, setShowVariantSelector] = useState(false);
  const [showARButton, setShowARButton] = useState(false);
  const [hasARFailed, setHasARFailed] = useState(false);
  const [modelViewerMode, setModelViewerMode] = useState(
    "webxr scene-viewer quick-look"
  );
  const [isARInPresentMode, setIsARInPresentMode] = useState(false);
  const [isARObjectPlaced, setIsARObjectPlaced] = useState(false);

  const modelViewerRef = useRef(null);

  let modelViewerVariants = null;
  let modelVariantNames = null;
  let select = null;

  useEffect(() => {
    // This is where we will initialize Model Viewer.
    // We'll do this asynchronously because it's a heavy operation.
    import("@google/model-viewer")
      .then(({ ModelViewerElement }) => {
        // Here, ModelViewerElement is now available and can be used.
        customElements.get("model-viewer") ||
          customElements.define("model-viewer", ModelViewerElement);
      })
      .catch((error) => {
        console.error("Error loading Model Viewer", error);
      });
  }, []); // We pass an empty dependency array so this runs once on mount.

  var currViewer = document.querySelector("#CurrProductViewer");
  currViewer?.addEventListener("ar-status", (event) => {
    console.log("AR Button Clicked");
    console.log(event);

    if (event.detail.status === "failed" && hasARFailed == false) {
      setHasARFailed(true);
      console.log("Failed to view AR");
    }

    if (event.detail.status == "session-started") {
      setIsARInPresentMode(true);
    } else if (event.detail.status == "not-presenting") {
      setIsARInPresentMode(false);
    } else if (event.detail.status == "object-placed") {
      setIsARObjectPlaced(true);
    }
  });

  currViewer?.addEventListener("load", () => {
    console.log("Can activate AR: " + currViewer.canActivateAR);
    setShowARButton(currViewer.canActivateAR);
  });

  const getCurrentTimestamp = () => {
    const now = new Date();
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    return now.toLocaleString("en-GB", options).replace(/[/,:]/g, "-"); // Format the date and replace slashes and commas
  };

  const handleScreenshot = async () => {
    console.log("Screenshot button clicked!"); // Debug log
    const modelViewer = modelViewerRef.current;

    if (!modelViewer) {
      console.error("Model viewer not found.");
      alert("Error: Model viewer not ready. Please wait for the model to load.");
      return;
    }

    console.log("Model viewer found:", modelViewer);

    try {
      // Ensure code only runs on the client side
      if (typeof window === "undefined") {
        console.error("Not in a browser environment.");
        return;
      }

      console.log("Waiting for model to complete...");
      // Wait for the model to fully render
      await modelViewer.updateComplete;
      console.log("Model update complete!");

      // Capture screenshot from model-viewer
      console.log("Attempting to capture screenshot...");
      const screenshotDataURL = modelViewer.toDataURL("image/png");
      console.log("Screenshot captured! Data URL length:", screenshotDataURL?.length);

      // Create Image object on the client side
      const screenshotImage = new window.Image();
      screenshotImage.src = screenshotDataURL;

      screenshotImage.onload = async () => {
        console.log("Screenshot image loaded, creating canvas...");
        // Create a canvas to overlay the watermark
        const tempCanvas = document.createElement("canvas");
        const ctx = tempCanvas.getContext("2d");

        // Set canvas size to match the screenshot
        tempCanvas.width = screenshotImage.width;
        tempCanvas.height = screenshotImage.height;

        //Fill the canvas with a white background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        // Draw the screenshot onto the canvas
        ctx.drawImage(screenshotImage, 0, 0);


        // Fetch and render the logo onto the canvas
        console.log("Loading logo...");
        const logoURL = "/Logos/BFSHorizontal.png"; // PNG logo path

        const logoImage = new window.Image();
        logoImage.crossOrigin = "anonymous"; // Handle CORS if needed
        logoImage.src = logoURL;

        logoImage.onload = async () => {
          console.log("Logo loaded, adding watermark...");
          // Position the logo in the bottom-right corner with padding
          const padding = 20;
          const logoWidth = 300;
          const logoHeight = (logoImage.height / logoImage.width) * logoWidth;

          const x = tempCanvas.width - logoWidth - padding;
          const y = tempCanvas.height - logoHeight - padding;

          // Draw the logo onto the canvas
          ctx.drawImage(logoImage, x, y, logoWidth, logoHeight);

          console.log("Creating download link...");
          // Convert the canvas back to a data URL
          const finalImage = tempCanvas.toDataURL("image/png");

          // Convert Data URL to Blob for download and sharing
          const response = await fetch(finalImage);
          const blob = await response.blob();
          const file = new File(
            [blob],
            `TIF-${productInfo?.data?.productName || "TIF"
            } ${getCurrentTimestamp()}.png`,
            { type: "image/png" }
          );

          console.log("Triggering download...");
          // Trigger download of the final image
          const link = document.createElement("a");
          link.href = URL.createObjectURL(file);
          link.download = file.name;
          link.click();
          console.log("Download triggered!");

          // No need to revoke URL since we're loading PNG directly

          // Trigger the native share popup if supported ||ENABLE THIS FOR SHARING FUNCTIONALITY
          const productLink = window.location.href; // Current page URL

          if (navigator.share) {
            console.log("Attempting to share...");
            try {
              await navigator.share({
                title: "Check out this product!",
                text: "I captured this using TryItFirst! View the product here:",
                url: productLink, // Adding the product/page URL
                files: [file], // Include the image
              });
              console.log("Shared successfully!");
            } catch (shareError) {
              console.error("Error sharing:", shareError);
            }
          } else {
            console.log("Sharing is not supported on this device.");
            alert("Screenshot downloaded! Sharing is not supported on this device.");
          }
        };

        logoImage.onerror = (error) => {
          console.error("Error loading logo:", error);
          alert("Error: Could not load watermark logo.");
        };
      };

      screenshotImage.onerror = (error) => {
        console.error("Error loading screenshot:", error);
        alert("Error: Could not process screenshot.");
      };
    } catch (error) {
      console.error("Error capturing screenshot:", error);
      alert(`Error capturing screenshot: ${error.message}`);
    }
  };

  useEffect(() => {
    //console.log("PRODUCT DATA UPDATED");
    modelViewerVariants = document.querySelector("#CurrProductViewer");
    //console.log("Model Viewer Element - " + modelViewerVariants);

    if (modelViewerVariants != null) {
      modelViewerVariants.addEventListener("load", () => {
        modelVariantNames = modelViewerVariants.availableVariants;

        if (analyticsOnLoad360) {
          analyticsOnLoad360();
          console.log("Loaded 360");
        }

        if (modelVariantNames.length > 0) {
          setShowVariantSelector(true);
        } else setShowVariantSelector(false);
      });
    }
  }, [productInfo]);

  useEffect(() => {
    if (showVariantSelector) {
      modelViewerVariants = document.querySelector("#CurrProductViewer");
      modelVariantNames = modelViewerVariants.availableVariants;
      select = document.querySelector("#VariantDropdown");
      select.length = 0;

      for (const name of modelVariantNames) {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = "Style - " + name;
        select.appendChild(option);
      }

      VariantDropdown.addEventListener("input", (event) => {
        if (analyticsOnVariantChanged) analyticsOnVariantChanged();
        modelViewerVariants.variantName =
          event.target.value === "default" ? null : event.target.value;
      });
    }
  }, [showVariantSelector]);

  useEffect(() => {
    console.log(
      "State Changed | Dimensions: " + showDimensions + " | Depth: " + showDepth
    );
    if (showDepth) setModelViewerMode("scene-viewer quick-look");
    else setModelViewerMode("webxr scene-viewer quick-look");
  }, [showDepth, showDimensions]);

  function HandleClick_ARbutton() {
    console.log("AR button clicked");
    if (analyticsOnARView) analyticsOnARView();
  }
  // start of new code for depth
  // Update ar-modes and ar-depth attributes on the model-viewer element
  useEffect(() => {
    const viewer = modelViewerRef.current || document.querySelector("#CurrProductViewer");
    if (viewer) {
      // Wait for model-viewer to be ready
      if (viewer.updateComplete) {
        viewer.updateComplete.then(() => {
          viewer.setAttribute("ar-modes", modelViewerMode);
          if (showDepth) {
            viewer.setAttribute("ar-depth", "auto");
          } else {
            viewer.removeAttribute("ar-depth");
          }
        });
      } else {
        // Fallback if updateComplete is not available
        viewer.setAttribute("ar-modes", modelViewerMode);
        if (showDepth) {
          viewer.setAttribute("ar-depth", "auto");
        } else {
          viewer.removeAttribute("ar-depth");
        }
      }
    }
  }, [modelViewerMode, showDepth]);

  //end of new code for depth






  /* Depth */
  function HandleDepthToggle() {
    if (!showDepth) {
      setShowDimensions(false);
      setDimensionVisibility(false);
    }
    setShowDepth((prev) => !prev);
  }
  /* End Depth */

  /* Dimensions */
  const dimElements = currViewer
    ? [
      ...currViewer.querySelectorAll("#dimID"),
      currViewer.querySelector("#dimLines"),
    ]
    : null;

  function HandleDimesionToggle() {
    if (!showDimensions) setShowDepth(false);
    setDimensionVisibility(!showDimensions);
    setShowDimensions((prev) => !prev);
  }

  function setDimensionVisibility(visible) {
    console.log("Setting Dim Visibility - " + visible);
    dimElements.forEach((element) => {
      if (visible) {
        element.classList.remove("hide");
      } else {
        element.classList.add("hide");
      }
    });
  }

  function drawLine(svgLine, dotHotspot1, dotHotspot2, dimensionHotspot) {
    if (dotHotspot1 && dotHotspot2) {
      svgLine.setAttribute("x1", dotHotspot1.canvasPosition.x);
      svgLine.setAttribute("y1", dotHotspot1.canvasPosition.y);
      svgLine.setAttribute("x2", dotHotspot2.canvasPosition.x);
      svgLine.setAttribute("y2", dotHotspot2.canvasPosition.y);

      if (dimensionHotspot && !dimensionHotspot.facingCamera) {
        svgLine.classList.add("hide");
      } else {
        svgLine.classList.remove("hide");
      }
    }
  }

  const dimLines = currViewer?.querySelectorAll("line");

  const renderSVG = () => {
    drawLine(
      dimLines[0],
      currViewer.queryHotspot("hotspot-dot+X-Y+Z"),
      currViewer.queryHotspot("hotspot-dot+X-Y-Z"),
      currViewer.queryHotspot("hotspot-dim+X-Y")
    );
    drawLine(
      dimLines[1],
      currViewer.queryHotspot("hotspot-dot+X-Y-Z"),
      currViewer.queryHotspot("hotspot-dot+X+Y-Z"),
      currViewer.queryHotspot("hotspot-dim+X-Z")
    );
    drawLine(
      dimLines[2],
      currViewer.queryHotspot("hotspot-dot+X+Y-Z"),
      currViewer.queryHotspot("hotspot-dot-X+Y-Z")
    ); // always visible
    drawLine(
      dimLines[3],
      currViewer.queryHotspot("hotspot-dot-X+Y-Z"),
      currViewer.queryHotspot("hotspot-dot-X-Y-Z"),
      currViewer.queryHotspot("hotspot-dim-X-Z")
    );
    drawLine(
      dimLines[4],
      currViewer.queryHotspot("hotspot-dot-X-Y-Z"),
      currViewer.queryHotspot("hotspot-dot-X-Y+Z"),
      currViewer.queryHotspot("hotspot-dim-X-Y")
    );
  };

  currViewer?.addEventListener("load", () => {
    const center = currViewer.getBoundingBoxCenter();
    const size = currViewer.getDimensions();
    const x2 = size.x / 2;
    const y2 = size.y / 2;
    const z2 = size.z / 2;

    currViewer.updateHotspot({
      name: "hotspot-dot+X-Y+Z",
      position: `${center.x + x2} ${center.y - y2} ${center.z + z2}`,
    });

    currViewer.updateHotspot({
      name: "hotspot-dim+X-Y",
      position: `${center.x + x2 * 1.2} ${center.y - y2 * 1.1} ${center.z}`,
    });
    currViewer.querySelector(
      'button[slot="hotspot-dim+X-Y"]'
    ).textContent = `${(size.z * 100).toFixed(0)} cm`;

    currViewer.updateHotspot({
      name: "hotspot-dot+X-Y-Z",
      position: `${center.x + x2} ${center.y - y2} ${center.z - z2}`,
    });

    currViewer.updateHotspot({
      name: "hotspot-dim+X-Z",
      position: `${center.x + x2 * 1.2} ${center.y} ${center.z - z2 * 1.2}`,
    });
    currViewer.querySelector(
      'button[slot="hotspot-dim+X-Z"]'
    ).textContent = `${(size.y * 100).toFixed(0)} cm`;

    currViewer.updateHotspot({
      name: "hotspot-dot+X+Y-Z",
      position: `${center.x + x2} ${center.y + y2} ${center.z - z2}`,
    });

    currViewer.updateHotspot({
      name: "hotspot-dim+Y-Z",
      position: `${center.x} ${center.y + y2 * 1.1} ${center.z - z2 * 1.1}`,
    });
    currViewer.querySelector(
      'button[slot="hotspot-dim+Y-Z"]'
    ).textContent = `${(size.x * 100).toFixed(0)} cm`;

    currViewer.updateHotspot({
      name: "hotspot-dot-X+Y-Z",
      position: `${center.x - x2} ${center.y + y2} ${center.z - z2}`,
    });

    currViewer.updateHotspot({
      name: "hotspot-dim-X-Z",
      position: `${center.x - x2 * 1.2} ${center.y} ${center.z - z2 * 1.2}`,
    });
    currViewer.querySelector(
      'button[slot="hotspot-dim-X-Z"]'
    ).textContent = `${(size.y * 100).toFixed(0)} cm`;

    currViewer.updateHotspot({
      name: "hotspot-dot-X-Y-Z",
      position: `${center.x - x2} ${center.y - y2} ${center.z - z2}`,
    });

    currViewer.updateHotspot({
      name: "hotspot-dim-X-Y",
      position: `${center.x - x2 * 1.2} ${center.y - y2 * 1.1} ${center.z}`,
    });
    currViewer.querySelector(
      'button[slot="hotspot-dim-X-Y"]'
    ).textContent = `${(size.z * 100).toFixed(0)} cm`;

    currViewer.updateHotspot({
      name: "hotspot-dot-X-Y+Z",
      position: `${center.x - x2} ${center.y - y2} ${center.z + z2}`,
    });

    renderSVG();

    currViewer.addEventListener("camera-change", renderSVG);
  });
  /* End Dimensions */

  return (
    <section className="flex items-center justify-center w-full h-full">
      <model-viewer
        id="CurrProductViewer"
        ref={modelViewerRef}
        src={productInfo.data.glb}
        //ios-src={productInfo.data.usdz}
        poster={productInfo.data.poster}
        alt={"3D model of " + productInfo.data.productName}
        shadow-intensity="1"
        tone-mapping="commerce"
        camera-orbit="-30deg auto auto"
        max-camera-orbit="auto 100deg auto"
        camera-controls
        touch-action="pan-y"
        //auto-rotate
        autoplay 
        ar
        //ar-modes="webxr scene-viewer quick-look"
        ar-modes={modelViewerMode}
        ar-scale="fixed"
      >
        <button
          slot="hotspot-dot+X-Y+Z"
          id="dimID"
          class="dot"
          data-position="1 -1 1"
          data-normal="1 0 0"
        ></button>
        <button
          slot="hotspot-dim+X-Y"
          id="dimID"
          class="dim"
          data-position="1 -1 0"
          data-normal="1 0 0"
        ></button>
        <button
          slot="hotspot-dot+X-Y-Z"
          id="dimID"
          class="dot"
          data-position="1 -1 -1"
          data-normal="1 0 0"
        ></button>
        <button
          slot="hotspot-dim+X-Z"
          id="dimID"
          class="dim"
          data-position="1 0 -1"
          data-normal="1 0 0"
        ></button>
        <button
          slot="hotspot-dot+X+Y-Z"
          id="dimID"
          class="dot"
          data-position="1 1 -1"
          data-normal="0 1 0"
        ></button>
        <button
          slot="hotspot-dim+Y-Z"
          id="dimID"
          class="dim"
          data-position="0 -1 -1"
          data-normal="0 1 0"
        ></button>
        <button
          slot="hotspot-dot-X+Y-Z"
          id="dimID"
          class="dot"
          data-position="-1 1 -1"
          data-normal="0 1 0"
        ></button>
        <button
          slot="hotspot-dim-X-Z"
          id="dimID"
          class="dim"
          data-position="-1 0 -1"
          data-normal="-1 0 0"
        ></button>
        <button
          slot="hotspot-dot-X-Y-Z"
          id="dimID"
          class="dot"
          data-position="-1 -1 -1"
          data-normal="-1 0 0"
        ></button>
        <button
          slot="hotspot-dim-X-Y"
          id="dimID"
          class="dim"
          data-position="-1 -1 0"
          data-normal="-1 0 0"
        ></button>
        <button
          slot="hotspot-dot-X-Y+Z"
          id="dimID"
          class="dot"
          data-position="-1 -1 1"
          data-normal="-1 0 0"
        ></button>
        <svg
          id="dimLines"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          class="dimensionLineContainer"
        >
          <line class="dimensionLine"></line>
          <line class="dimensionLine"></line>
          <line class="dimensionLine"></line>
          <line class="dimensionLine"></line>
          <line class="dimensionLine"></line>

        </svg>

        <div
          slot="ar-button"
          id="ARbutton"
          className={`${showARButton ? "" : "hidden"} ${hasARFailed ? "hidden" : ""
            } absolute top-4 right-0 flex items-center justify-end px-4 py-4 w-fit h-auto z-50`}
          onClick={() => HandleClick_ARbutton()}
        >
          <button className="flex items-center justify-center px-4 py-2 gap-2 bg-black text-white rounded-lg shadow-xl border border-gray-800">
            <Codesandbox className="w-5 h-5" />
            <h1 className="text-sm font-medium">AR view</h1>
          </button>
        </div>

        {hasARFailed && (
          <div className="absolute right-0 flex items-center justify-end px-2 py-4 w-fit h-auto">
            <div className="flex items-center justify-center px-4 py-2 gap-2 border-2 border-tif-blue text-tif-blue rounded-full">
              <ExclamationTriangleIcon className="w-5 h-5" />
              <h1 className="text-xs">Sorry, your device doesn't support AR</h1>
            </div>
          </div>
        )}

        {!isARInPresentMode && (
          <div className="absolute top-[50%] right-2.5 flex items-center justify-center gap-2 w-fit h-fit -translate-y-[50%] z-40 pointer-events-auto">
            <button
              onClick={handleScreenshot}
              className="relative flex items-center justify-center w-14 h-14 bg-[#ffffff] border border-[#DCDCDC] text-black rounded-full shadow-md"
            >
              <div className="absolute w-12 h-12 rounded-full border-2 border-[#DCDCDC] " />
              <Camera className="w-6 h-6" />
            </button>
          </div>
        )}

        <div className="absolute top-0 flex items-center justify-center gap-2 w-full mt-4 z-40">
          <Image
            src="/Logos/BFSHorizontal.png"
            alt="Try It First Logo"
            width={100}
            height={32}
            className="animate-slideInSpringedBottom pb-2"
          />
        </div>

        <div className="absolute bottom-[9vh] flex flex-col items-center justify-center gap-1 w-full px-4 pb-2 z-50 pointer-events-auto">
          <div className="flex items-center justify-center w-full gap-1">
            <button
              class="nonDim"
              className={`flex items-center justify-center py-2 px-4 gap-2 w-full text-sm font-medium rounded-tl-lg border border-[#D3D3D3] shadow-sm transition-colors ${showDimensions
                ? "bg-[#E1E1E1] text-black "
                : "bg-[#E1E1E1] text-gray-600 "
                }`}
              onClick={() => HandleDimesionToggle()}
            >
              {showDimensions ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
              <h1>Dimensions</h1>
            </button>

            {!isARInPresentMode && (
              <button
                class="nonDim"
                className={`flex items-center justify-center py-2 px-4 gap-2 w-full text-sm font-medium rounded-tr-lg border border-[#D3D3D3] shadow-sm transition-colors ${showDepth
                  ? "bg-[#B8B8B8] text-black "
                  : "bg-[#B8B8B8] text-black "
                  }`}
                onClick={() => HandleDepthToggle()}
              >
                {showDepth ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
                <h1>Depth</h1>
              </button>
            )}
          </div>

          {showVariantSelector && (
            <div className="relative w-full">
              <select
                id="VariantDropdown"
                className="w-full p-3 bg-white text-black text-sm font-medium rounded-b-lg shadow-sm border border-[#D3D3D3] appearance-none focus:outline-none focus:ring-1 focus:ring-[#D3D3D3] focus:border-[#D3D3D3]"
              ></select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          )}
        </div>

        {isARInPresentMode && !isARObjectPlaced && <ARGuidePrompt />}
      </model-viewer>
    </section >
  );
};

export default ProductViewModelCard;

const ARGuidePrompt = () => {
  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center z-[60]  backdrop-blur-md backdrop-saturate-150">
      <div className="flex flex-col items-center justify-center w-80 h-40 bg-white rounded-lg shadow-lg overflow-clip">
        <div className="relative flex items-center justify-center w-full h-full">
          <Image
            src="/Icons/Icon_ARPhone.svg"
            width={64}
            height={64}
            className="z-10 animate-arDetectFloorGuide"
          />
          <Image
            src="/Icons/Icon_FloorGrid.svg"
            fill={true}
            style={{ objectFit: "cover" }}
            className="opacity-25"
          />
        </div>
        <div className="flex items-center justify-center w-full h-[20%] text-xs font-medium">
          Move your phone around slowly to detect the floor
        </div>
      </div>
    </div>
  );
};
