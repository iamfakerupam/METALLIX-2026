import Image from "next/image";
import { HeroVideoDemo } from "./Hero";
import { ImageTrailDemo } from "./About";
import Event from "./Event";
import Timeline from "./Timeline";
import FAQs from "./Faq";
import { DemoOne } from "./ScrollAdventure";

export default function Home() {
  return (
    <div className=" min-h-screen  font-sans bg-black">
      <HeroVideoDemo/>
      <ImageTrailDemo/>
      <div className="text-white text-7xl font-extrabold flex flex-col items-center justify-center mt-10 mb-5 p-4 ">
        <h1 className="text-7xl text-white font-extrabold" >EVENTS</h1>
        <p className="text-purple-500 text-2xl font-bold" >
        Metallix 2026 brings for you 8 interesting events each being one of its kind.
      </p>
      <p className="text-xl font-extrabold text-yellow-200" >
        Event Registrations are now Absolutely FREE for both JU/Non-JU students!
      </p>
       <p className="text-xl font-extrabold text-orange-500" >
        Win prizes upto 1 Lakh INR! Winner and Participation certificates included.
      </p>
      </div>
      
      <Event/>
      <DemoOne/>
      <FAQs/>
    </div>
  )
}
