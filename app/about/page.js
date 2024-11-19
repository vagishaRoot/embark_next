"use client";

import React, {useEffect} from 'react'
import { textState } from "../state/state"
import { useRecoilState } from "recoil"

export default function About () {
    const [text, setText] = useRecoilState(textState)

    useEffect(()=>{
        setText('Hello')
    },[])
    return (
        <h1>{text}</h1>
    )
}