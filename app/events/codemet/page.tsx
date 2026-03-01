import EventDescriptionHero from '@/components/EventDescription'
import React from 'react'

const page = () => {
  return (
    <div>
        <EventDescriptionHero
  image="/codemet.png"
  title="CODEMET"
  description="A premier competitive coding event where the brightest minds battle through algorithmic challenges. Test your logic, speed, and creativity across multiple rounds of intense problem-solving."
  contactName="Utpalendu Ray"
  contactNumber="+91 8670406520"
  location="Revealed Soon"
  date="April 2, 2026"
  time="Revealed Soon"
/>
    </div>
  )
}

export default page