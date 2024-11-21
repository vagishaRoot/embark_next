"use client"
import React from 'react'
import "../css/about.css"
// import image1 from "../assets/about_1.png"
// import image2 from "../assets/about_2.png"
// import { navigateState } from '../state/AppAtom'
// import { useRecoilState } from 'recoil';
// import video from "../assets/video/about_us.mp4"
import ReactPlayer from 'react-player';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


const About_Us = () => {

//   const [navigation,setNavigation] = useRecoilState(navigateState)
  // const videoRef = useRef(null);

  // useEffect(() => {
    // setNavigation("About_Us")
    // let secondDiv = document.getElementById("topHeader")
    // secondDiv.scrollIntoView({ behavior: "smooth", block: "start" })
  // }, [])

  // useEffect(() => {
  //   if (videoRef.current) {
  //     videoRef.current.play();
  //   }
  // }, []);

  return (
    <>

      <Navbar />
      <div className=' w-full'>
      <img src="/images/about_banner.png" className='w-full' />
        {/* <div className=' circle w-[300px] h-[300px] flex flex-col justify-center gap-y-4  '>
          <h1 className=' text-2xl font-bold text-black  underline underline-offset-4 font-small  px-12'>About us our creative world</h1>
          <p className=' text-xl font-medium text-black leading-8 font-small '>Explore the world of Reverse Coloring Books!</p>
        </div> */}
      </div>
      <div className="w-full flex justify-center py-[15px]">
        <div className="flex max-768:flex-col max-768:items-center max-768:gap-y-[30px] justify-center w-[80%] gap-x-[25px] items-start">
          {/* <video ref={videoRef} width="600" height="240" controls autoPlay>
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>  */}
          <ReactPlayer
            url="/video/about_us.mp4"
            playsinline
            controls
            playing
            loop
            width="640"
            height="360"
            volume="0.25"         
          />
          <div className="flex flex-col w-full 1330-1024:w-[80%] max-1024:w-[95%] max-768:w-full gap-y-10">
            <p className='text-lg 768-650:text-sm max-650:text-base font-medium max-650:text-center'>Welcome to our <span className='font-bold bg-sky-500 text-white capitalize px-[2px]'> colourful world!</span> We are a duo of artists on a joyful mission to spread <span className='font-bold bg-sky-500 text-white capitalize px-[2px]'>happiness and positivity</span> through our vibrant illustrations. Art, for us, is not just a hobby; it's a <span className='font-bold bg-pink-600 text-white capitalize px-[2px]'>transformative journey</span> that evokes a sense of wonder and delight in everyone who comes across it. Through our work, we aim to contribute to a world that is as bright and uplifting as the palettes we use.</p>
            <div className=' flex items-center max-650:flex-col'>
              {/* <img src={image1} alt='About image ' className='w-[50%] h-60 border-2 max-650:w-auto ' /> */}
              <p className=' text-lg 768-650:text-sm max-650:text-base font-medium max-650:w-full max-650:text-center '>
                Our journey is deeply rooted in the belief that art has the power to reflect and refine our inner selves. It's a <span className='font-bold bg-emerald-700 text-white capitalize px-[2px]'>visual symphony</span> that captures our innermost thoughts, feelings, and dreams, weaving them into a tapestry that resonates across time and space. This belief in the <span className='font-bold bg-orange-400 text-white capitalize px-[2px]'>power of art</span> to nurture the soul has led us to adopt a unique approach to self-reflection and <span className='font-bold bg-red-500 text-white capitalize px-[2px]'>creativity.</span></p>
            </div>
            <p className='text-lg 768-650:text-sm max-650:text-base font-medium max-650:text-center '>
            Introducing our innovative concept: the <span className='font-bold bg-sky-500 text-white capitalize px-[2px]'>Reverse Colouring Book.</span> This isn't just any colouring book; it's a canvas for <span className='font-bold bg-blue-600 text-white capitalize px-[2px]'>emotional expression</span> and personal growth. Our reverse colouring book stands as a testament to our <span className='font-bold bg-lime-700 text-white capitalize px-[2px]'>creativity</span>, where one of us brings life to ideas through <span className='font-bold bg-green-700 text-white capitalize px-[2px]'>vivid sketches</span> that reflect deep, personal emotions, while the other weaves words into intricate tapestries that tell our stories.</p>
            <div className=' flex items-center gap-10 max-650:flex-col-reverse'>
              <p className=' text-lg 768-650:text-sm max-650:text-base font-medium max-650:w-full max-650:text-center'>
                As individuals, we cherish <span className='font-bold bg-pink-600 text-white capitalize px-[2px]'>kindness and consideration—values</span> that guide our interactions and our art. Every piece we create, every line we draw, and every story we tell is an invitation to join us in this <span className='font-bold bg-indigo-800 text-white capitalize px-[2px]'>vibrant journey.</span>
              </p>
              {/* <img src={image2} alt='About image ' className='w-[50%] h-60 border-2  max-650:w-auto' /> */}
            </div>
            <p className='text-lg 768-650:text-sm max-650:text-base font-medium max-650:text-center'>
              Join us in making the world a more colourful place, one illustration at a time. Let's paint our dreams and carve out spaces for joy and reflection together. Because here, every moment of <span className='font-bold bg-yellow-700 text-white capitalize px-[2px]'>creativity</span> is an investment in a brighter, <span className='font-bold bg-rose-600 text-white capitalize px-[2px]'>more uplifting tomorrow.</span>
            </p>
            <p className='text-lg 768-650:text-sm max-650:text-base font-medium max-650:text-center'>
              Explore, enjoy, and be inspired as we share our hearts with you through every colour and every word
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default About_Us
