"use client";

import React, { useEffect, useState } from "react";
import { Switch } from "antd";
import {
  getAllUsers,
  searchByEmail,
  updateUsers,
} from "../../adminServices/userApi";
import Icons from "../../Icons/Icons";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/app/components/AdminNavbar";

const User = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchUser, setSearchUser] = useState(false);
  const [loader, setLoader] = useState(false);
  const [pagination, setPagination] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

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

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    let selectedNavbar = document.querySelector(".user-page");
    selectedNavbar.style.background = "#46aed1";
    selectedNavbar.style.color = "white";

    return () => {
      selectedNavbar.style.background = "transparent";
      selectedNavbar.style.color = "black";
    };
  }, []);

  const fetchUser = (nextPage) => {
    setLoader(true);
    getAllUsers()
      .then((res) => {
        setLoader(false);
        console.log(res.data.users);
        if (nextPage === undefined) {
          setUsers(res.data.users);
          setCurrentPage(1);
          setPagination(
            Array.from({ length: res.data.totalPages }, (_, index) => index + 1)
          );
        } else {
          setUsers([...users, res.data.users]);
        }
      })
      .catch((err) => {
        setLoader(false);
        console.error(err);
      });
  };

  const onChange = (check, id) => {
    let obj = { check: !check };
    const header = {
      headers: {
        Authorization: `Bearer ${
          localStorage.getItem("logginId").split("--")[1]
        }`,
      },
    };
    updateUsers(id, obj, header)
      .then((res) => {
        console.log(res.data);
        fetchUser();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getDates = () => {
    let timeStings =
      Math.floor(
        Math.random() * (new Date().getTime() - new Date(1).getTime() + 1)
      ) + new Date(1).getTime();
    return `${new Date(timeStings).getDate()}/${
      new Date(timeStings).getMonth() + 1
    }/2023`;
  };

  const search = () => {
    setLoader(true);
    const header = {
      headers: {
        Authorization: `Bearer ${
          localStorage.getItem("logginId").split("--")[1]
        }`,
      },
    };
    searchByEmail(searchInput, header)
      .then((res) => {
        setLoader(false);
        console.log(res.data);
        setUsers(res.data.users);
        setSearchUser(true);
      })
      .catch((err) => {
        setLoader(false);
        console.log(err);
      });
  };

  const clearSearch = () => {
    setSearchUser(false);
    setSearchInput("");
    fetchUser();
  };

  return (
    <>
      <AdminNavbar />
      <div className=" flex max-425:justify-between max-425:gap-0 gap-5 mt-10 px-10 max-425:mx-0 max-425:px-[5px] w-full">
        <input
          type="text"
          placeholder="Enter Full Email"
          className=" outline-none border w-[300px] max-425:w-[180px] h-10 pl-4 border-black "
          onChange={(e) => setSearchInput(e.target.value)}
          value={searchInput}
        />
        <button
          className=" border w-[120px] h-10 bg-[#0C680F] text-white text-lg font-semibold "
          onClick={search}
        >
          Search
        </button>
      </div>
      {loader ? (
        <div className="flex w-full justify-center">
          <Icons string="loading" />
        </div>
      ) : (
        <div className="w-full flex justify-center max-1330:overflow-x-auto max-1330:justify-start px-[20px]">
          {users.length ? (
            <div className="mt-[40px]">
              <div className=" flex gap-2  px-[15px] ">
                <h1 className=" w-[200px] text-xl font-bold ">Name</h1>
                <h1 className=" w-[300px] text-xl font-bold text-left">
                  Email
                </h1>
                <h1 className=" w-[200px] text-xl font-bold text-center ">
                  Verified Account
                </h1>
                <h1 className=" w-[200px] text-xl font-bold text-center">
                  No. Of Orders
                </h1>
                {/* <h1 className=" w-full text-xl font-bold ">Last Purchase Date</h1> */}
                <h1 className=" w-[100px] text-xl font-bold ">Allowance</h1>
              </div>
              {/* <div className=' h-1 flex justify-center w-[50%] mx-auto bg-black mt-2 ' ></div> */}
              <div className=" flex flex-col mt-2 gap-y-[10px]">
                {users.map((item, idx) => (
                  <div
                    key={item._id}
                    className="shadow-[0_0_3px_#333] rounded-lg px-[15px]"
                  >
                    <div className=" flex gap-2 my-2  py-3">
                      <h1 className=" w-[200px]">{item.username}</h1>
                      <h1 className=" w-[300px]  ">{item.email}</h1>
                      <h1 className=" w-[200px] flex justify-center">
                        {item.otp_verfi ? (
                          <Icons string="Green Circle" />
                        ) : (
                          <Icons string="Red Circle" />
                        )}
                      </h1>
                      <h1 className=" w-[200px] flex justify-center">
                        {item.orders}
                      </h1>
                      {/* <h1 className=" w-full ">{getDates()}</h1> */}
                      <h1 className=" w-[100px] ">
                        <Switch
                          defaultChecked={item.check}
                          onChange={() => onChange(item.check, item._id)}
                        />
                      </h1>
                    </div>
                    {/* <div className=' h-1 flex justify-center w-[50%] mx-auto bg-black ' ></div> */}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[150px] flex items-end">
              <div className="text-2xl font-bold">No Users Found</div>
            </div>
          )}
        </div>
      )}

      {pagination.length && pagination.length > 1 ? (
        <div className="w-full flex items-center justify-center gap-[2px]">
          {pagination.map((v, i) => (
            <div
              key={i}
              onClick={() => (currentPage >= v ? {} : nextPage(v))}
              className={`w-[50px] h-[50px] cursor-pointer border ${
                currentPage === v
                  ? "bg-blue-500 text-white border-blue-500"
                  : currentPage > v
                  ? "bg-gray-200 text-gray-400 border-gray-400"
                  : "text-blue-500 border-blue-500"
              } flex justify-center items-center rounded`}
            >
              {v}
            </div>
          ))}
          <div
            onClick={() =>
              currentPage === pagination[pagination.length - 1]
                ? {}
                : nextPage(currentPage + 1)
            }
            className={`w-[40px] h-[40px] ml-[5px] flex justify-center items-center rounded-[8px] ${
              currentPage === pagination[pagination.length - 1]
                ? "bg-gray-200 text-gray-400 border-gray-400"
                : "bg-blue-500 text-white border-blue-500"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="white"
              className="bi bi-chevron-right"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
              />
            </svg>
          </div>
        </div>
      ) : (
        <></>
      )}

      {searchUser ? (
        <div
          className="flex w-full justify-center mt-[20px]"
          onClick={clearSearch}
        >
          <button className="bg-[#0C680F] px-[10px] py-[5px] text-white">
            Clear Search
          </button>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default User;
