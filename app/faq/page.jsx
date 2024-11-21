"use client";

import React, { useEffect, useState } from "react";
import { navigateState } from "../state/appAtom";
import { useRecoilState } from "recoil";
import { getAllFaq } from "../services/faqAPI";
import Icons from "../Icons/Icons";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Faq = () => {
  const [faqs, setFaqs] = useState([]);
  const [navigation, setNavigation] = useRecoilState(navigateState);

  useEffect(() => {
    fetchFaq();
    setNavigation("Faq");
    let secondDiv = document.getElementById("topHeader");
    secondDiv.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const fetchFaq = () => {
    getAllFaq()
      .then((res) => {
        console.log(res.data);
        setFaqs(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const openAccordion = (i) => {
    let arr = [...faqs];

    arr[i]["active"] = !arr[i]["active"];

    setFaqs(arr);
  };
  return (
    <>
      <Navbar />
      {faqs ? (
        <div className="flex justify-center pt-[20px] pb-[45px]">
          <div className="w-[80%] flex justify-between items-start max-768:flex-wrap max-425:w-[95%]">
            <div className="w-1/2 max-768:w-full">
              <img src="/images/faq.jpg" />
            </div>
            <div className="w-1/2 flex flex-col gap-y-[15px] max-768:w-full">
              {faqs.length ? (
                faqs.map((v, i) => (
                  <div
                    className={`${
                      !!v.active ? "accordion-active" : "accordion-non-active"
                    } accordion-div`}
                    key={i}
                  >
                    <div
                      className={`accordion text-72514A select-none w-full px-[20px] py-[10px] ${
                        !!v.active ? "active" : ""
                      } flex justify-between pointer`}
                      onClick={() => openAccordion(i)}
                    >
                      <div
                        className={
                          !!v.active
                            ? "underline underline-offset-4 decoration-double decoration-1"
                            : ""
                        }
                      >
                        {v.questions}
                      </div>
                      <svg width="24" height="24" viewBox="0 0 24 24">
                        <path
                          d="M0 0h24v24H0V0z"
                          style={{ fill: "none" }}
                        ></path>
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"></path>
                      </svg>
                    </div>
                    <div className="info panel px-[20px]">{v.ans}</div>
                  </div>
                ))
              ) : (
                <div className="flex w-full justify-center h-full items-center">
                  <Icons string="loading" />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Icons string="loading" />
      )}
      <Footer />
    </>
  );
};

export default Faq;
