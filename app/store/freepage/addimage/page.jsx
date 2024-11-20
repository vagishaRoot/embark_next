"use client"

import React, { useEffect, useState } from "react";
import { addFreeImages } from "../../../adminServices/FreeImageApi";
import { notification } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AddImage = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [allFiles, setAllFiles] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const [loader, setLoader] = useState(false);
  const router = useRouter()
  const maxUploadLimit = 10; // Set your desired limit here

  useEffect(() => {
    if (localStorage.getItem("logginId") === null) {
      router.push("/store");
    } else {
      if (localStorage.getItem("loginTime") === null) {
        router.push("/store");
      } else {
        let time = JSON.parse(localStorage.getItem("loginTime"));
        if (parseInt((new Date() - new Date(time)) / (1000 * 60 * 60)) > 23) {
          localStorage.removeItem("loggedId");
          localStorage.removeItem("loginTime");
          router.push("/store");
        }
      }
    }
  }, []);

  const handleMulti = (e) => {
    const files = e.target.files;

    if (files.length > maxUploadLimit) {
      setErrorMessage(
        `You can only upload up to ${maxUploadLimit} images at a time.`
      );
      return;
    }

    setUploadedImages(Array.from(files));
    setAllFiles(files);

    setErrorMessage(""); // Clear previous error messages
  };

  const handleSubmit = () => {
    let token = localStorage.getItem("logginId");
    const header = {
      headers: {
        Authorization: `Bearer ${token.split("--")[1]}`,
        "Content-Type": "multipart/form-data",
      },
    };
    const formData = new FormData();

    for (let i = 0; i < allFiles.length; i++) {
      formData.append("images", allFiles[i]); // 'images' should match the field name expected by the server
    }
    if (header.headers.Authorization.includes("Bearer")) {
      setLoader(true);
      addFreeImages(formData, header)
        .then((res) => {
          if (res.response) {
          } else {
            setLoader(false);
            // console.log("Upload successful:", result);
            openNotification(res.data.message, true, "success");
            setTimeout(() => {
              router.push("/store/freepage");
            }, 3000);
            // setUploadedImages(result.images); // Update state with the uploaded images
          }
        })
        .catch((err) => {
          setLoader(false);
          console.log(err);
        });
    }
  };

  const openNotification = (message, pauseOnHover, type) => {
    api[type]({
      message,
      duration: 4,
      showProgress: true,
      pauseOnHover,
      placement: "topRight",
    });
  };

  return (
    <div className="text-center py-4 flex justify-center">
      {contextHolder}
      <div className="flex flex-col w-[90%] gap-y-5 items-start">
        <div className="w-full flex justify-start items-start">
          <Link
            href="/store/freepage"
            className="flex px-4 py-2 font-small cursor-pointer text-white bg-[#46AED1] items-center gap-x-2"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 44 44"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M42.8637 38.7613C43.3906 39.2889 43.6864 40.0041 43.6861 40.7497C43.6858 41.4953 43.3895 42.2102 42.8623 42.7375C42.3351 43.2647 41.6201 43.561 40.8746 43.5612C40.129 43.5615 39.4138 43.2657 38.8862 42.7388L20.1362 23.9888C19.6088 23.4614 19.3125 22.746 19.3125 22.0001C19.3125 21.2542 19.6088 20.5388 20.1362 20.0113L38.8862 1.26134C39.4138 0.734501 40.129 0.438704 40.8746 0.438965C41.6201 0.439226 42.3351 0.735525 42.8623 1.26273C43.3895 1.78994 43.6858 2.50492 43.6861 3.2505C43.6864 3.99609 43.3906 4.71127 42.8637 5.23885L26.1025 22.0001L42.8637 38.7613ZM7.35248 22.0001L24.1137 5.23885C24.6406 4.71127 24.9364 3.99609 24.9361 3.2505C24.9358 2.50492 24.6395 1.78994 24.1123 1.26273C23.5851 0.735525 22.8701 0.439226 22.1246 0.438965C21.379 0.438704 20.6638 0.734501 20.1362 1.26134L1.38622 20.0113C0.858798 20.5388 0.5625 21.2542 0.5625 22.0001C0.5625 22.746 0.858798 23.4614 1.38622 23.9888L20.1362 42.7388C20.6638 43.2657 21.379 43.5615 22.1246 43.5612C22.8701 43.561 23.5851 43.2647 24.1123 42.7375C24.6395 42.2102 24.9358 41.4953 24.9361 40.7497C24.9364 40.0041 24.6406 39.2889 24.1137 38.7613L7.35248 22.0001Z"
                fill="white"
              />
            </svg>
            Back to Store
          </Link>
        </div>
        <input
          type="file"
          id="fileInput"
          name="files[]"
          multiple
          accept="image/*"
          onChange={handleMulti}
        />

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        <div className="mt-7">
          {uploadedImages.length > 0 && (
            <div className="mt-7">
              <h3 className="font-bold text-xl">Uploaded Images:</h3>
              <div className="grid grid-cols-4">
                {uploadedImages.map((image, index) => (
                  <div
                    key={index}
                    className="flex flex-col justify-center mx-20 gap-0 border-2 w-[70%] mt-10"
                  >
                    <img
                      src={
                        typeof image === "string"
                          ? image
                          : URL.createObjectURL(image)
                      }
                      alt={`Uploaded ${index + 1}`}
                      className=""
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          className={`${uploadedImages.length === 0 ? 'bg-[#46aed18e] cursor-not-allowed' : 'bg-[#46AED1]'} text-white py-2 px-4 flex gap-x-[5px] items-center`}
          onClick={() => (loader ? {} : handleSubmit())}
          disabled={uploadedImages.length === 0}
        >
          Submit{" "}
          {loader ? (
            <img src="/images/loadingSpinner.gif" className="w-[16px]" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-check-circle"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
              <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default AddImage;
