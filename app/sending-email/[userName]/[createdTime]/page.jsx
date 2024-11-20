"use client"

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Redirection = ({params}) => {
  const { userName, createdTime } = params;
  const [loader, setLoader] = useState(false);
  const router = useRouter()
//   const history = 

  useEffect(() => {
    if (userName === undefined || createdTime === undefined) {
      localStorage.setItem("checked", false);
    } else {
      let time = createdTime.split("PAYID")[0];
      if (userName !== Cookies.get("username")) {
        localStorage.setItem("checked", false);
      } else if ((new Date() - new Date(parseInt(time))) / (1000 * 60) > 5) {
        localStorage.setItem("checked", false);
      } else {
        let obj = {}
        obj['username'] = userName
        obj['PayId'] = `PAYID-${createdTime.split("PAYID")[1]}`
        localStorage.setItem("checked", true);
        localStorage.setItem('credentials', JSON.stringify(obj))
        router.push('/redirecting')
        window.history.replaceState({}, document.title, "/redirecting");
      }
    }
  }, [userName, createdTime]);

  return <div>Redirection</div>;
};

export default Redirection;
