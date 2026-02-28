"use client";
import axios from "axios";
import LoadingIndicator from "@/components/Common/LoadingIndicator";
import ProductViewModelCard from "@/components/Product View/ProductViewModelCard/ProductViewModelCard";
import ProductViewNavBar from "@/components/Product View/ProductViewNavBar/ProductViewNavBar";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import usePlugin from "@/hooks/usePlugin";

var pageStartTime;
var viewDuration360;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://ipm5xt2sif.execute-api.us-east-1.amazonaws.com/dev';
const ANALYTICS_API = process.env.NEXT_PUBLIC_ANALYTICS_API || `${API_BASE_URL}/analytics/views`;

const ProductPlugin = ({ params }) => {
  const searchParams = useSearchParams();
  console.log(searchParams.get("companyID"));
  const { product, isProductLoading, isProductError } = usePlugin(
    params.productSKU,
    searchParams.get("companyID")
  );

  const router = useRouter();

  const [analyticsViewsFields, setAnalyticsViewsFields] = useState(null);
  const [loadTime360, setLoadTime360] = useState(0);

  console.log("Product Data Fetched: ");
  console.log(product);

  useEffect(() => {
    if (product) {
      SetAnalyticsData(product);
      pageStartTime = new Date().getTime();
      console.log(
        "Started Loading Page at " +
          pageStartTime +
          "ms at " +
          new Date().getTime()
      );
    }
  }, [product]);

  useEffect(() => {
    console.log(
      "Use Effect -> Analytics Views Fields -> " +
        JSON.stringify(analyticsViewsFields) +
        " | CALLED AT - " +
        new Date().getTime()
    );
  }, [analyticsViewsFields]);

  function SetAnalyticsData(productData) {
    console.log(
      "INITIAL ANALYTICS DATA SET CALLED AT - " + new Date().getTime()
    );
    console.log("Trying to set analytics- " + JSON.stringify(productData));
    var initial_anl_data = {
      productName: productData.data.productName,
      companyID: productData.data.companyID,
      productID: productData.data.productID,
      ARloadtime: 100,
      ARviews: 0,
      clicksToAddToCart: 0,
      clicksToWishlist: 0,
      clickToColorChange: 0,
      clickToTextureChange: 0,
      duration360: 0,
      durationAR: 7,
      Loadtime360: 0,
      productSKU: productData.data.productID,
      screenshotsInAR: 8,
      videosInAR: 9,
      views360: 1,
    };

    setAnalyticsViewsFields(initial_anl_data);
    console.log("Analytics data set: " + JSON.stringify(initial_anl_data));
  }

  function UpdateAnalyticsData_VariantChanged() {
    var anl_data = analyticsViewsFields;
    anl_data.clickToColorChange += 1;
    anl_data.clickToTextureChange += 1;

    console.log(
      "ANL UPDATE | Variant Changed | To: " + anl_data.clickToColorChange
    );

    setAnalyticsViewsFields(anl_data);
    console.log("Updated data set: " + JSON.stringify(analyticsViewsFields));
  }

  function UpdateAnalyticsData_ARViewActivated() {
    var anl_data = analyticsViewsFields;
    anl_data.ARviews += 1;

    console.log("ANL UPDATE | AR Views | To: " + anl_data.ARviews);

    setAnalyticsViewsFields(anl_data);
    console.log("Updated data set: " + JSON.stringify(analyticsViewsFields));
  }

  function UpdateAnalyticsData_LoadTime360() {
    let loadTime = (new Date().getTime() - pageStartTime) / 1000;
    setLoadTime360(loadTime);
    console.log("pageStartTime " + pageStartTime);
    console.log(
      "Load Time -> In Const: " + loadTime360 + " | In Calc: " + loadTime
    );
  }

  const uploadAnalytics = async () => {
    var anl_data = analyticsViewsFields;
    anl_data.Loadtime360 = loadTime360;
    anl_data.duration360 = viewDuration360;
    setAnalyticsViewsFields(anl_data);

    console.log(
      "Uploading analytics - " + JSON.stringify(analyticsViewsFields)
    );
    try {
      const response = await axios.patch(
        ANALYTICS_API,
        analyticsViewsFields
      );

      if (response.status === 200) {
        console.log("Analytics data upload successful");
      } else {
        console.log("Analytics upload error 1");
      }
    } catch (err) {
      console.log("Analytics upload error 2");
    }
  };

  function Callback_OnBackButtonClicked() {
    console.log(
      "CALCULATING DURATION -> Curr Time: " +
        new Date().getTime() +
        " | Start Time: " +
        pageStartTime
    );
    let duration = (new Date().getTime() - pageStartTime) / 1000;
    viewDuration360 = duration;
    console.log(
      "Duration 360 -> In Const: " + viewDuration360 + " | In Calc: " + duration
    );

    uploadAnalytics();
    router.back();
  }

  return (
    <main className="flex md:flex-row flex-col items-center justify-center w-screen h-[100svh] bg-black">
      <ProductViewNavBar
        Callback_OnBackButtonClicked={Callback_OnBackButtonClicked}        
      />
      {isProductLoading && (
        <section className="flex flex-col p-4 gap-2 items-center justify-between w-full text-gray-500">
          <LoadingIndicator />
          <span className="font-semibold lg:text-xl">Loading Product</span>
          <span className="font-light text-xs lg:text-sm">Please wait</span>
        </section>
      )}

      {product && product.data == null && !isProductLoading && (
        <section className="flex flex-col p-4 gap-2 items-center justify-between w-full text-red-500">
          <span className="font-semibold lg:text-xl">
            Sorry, there was an error while loading data
          </span>
          <span className="font-light text-xs lg:text-sm">
            Please refresh the page if you still see an error after 30 secs
          </span>
        </section>
      )}

      {isProductError && (
        <section className="flex flex-col p-4 gap-2 items-center justify-between w-full text-red-500">
          <span className="font-semibold lg:text-xl">
            Sorry, there was an error while loading data
          </span>
          <span className="font-light text-xs lg:text-sm">
            Please refresh the page if you still see an error after 30 secs
          </span>
        </section>
      )}

      {product && product.data != null && !isProductError && (
        <section className="flex md:flex-row flex-col md:items-center md:justify-center md:gap-6 md:p-6 w-full h-full">
          <section className="w-full h-full bg-white">
            <ProductViewModelCard
              productInfo={product}
              analyticsOnVariantChanged={UpdateAnalyticsData_VariantChanged}
              analyticsOnARView={UpdateAnalyticsData_ARViewActivated}
              analyticsOnLoad360={UpdateAnalyticsData_LoadTime360}
            />
          </section>
        </section>
      )}
    </main>
  );
};

export default ProductPlugin;
