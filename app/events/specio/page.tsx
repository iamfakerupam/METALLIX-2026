import EventDescriptionHero from '@/components/EventDescription'
import React from 'react'

const page = () => {
  return (
    <div>
        <EventDescriptionHero
  image="/specio.png"
  title="SPECIO"
  description="Specio rocks! It's Metallix'26's top metallography contest. Show off your skills in preparing samples, examining them with microscopes, and analyzing interesting images. Sign up now and join the excitement of exploring the fascinating world of metallography. Get ready to shine and win big!"
  contactName="Soham Kundu"
  contactNumber="+91 9749249756"
  location="Revealed Soon"
  date="April 3, 2026"
  time="Revealed Soon"
/>
    </div>
  )
}

export default page