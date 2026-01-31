import { EventCountdownCard } from '@/components/event-countdown-card'
import React from 'react'

const Event = () => {
  return (
    <div className='text-white text-5xl' >
        
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-20 gap-y-9 '>
        <EventCountdownCard title='CODEMET' date={new Date(2026, 2, 20,0,0 ,0)} />
        <EventCountdownCard title='HACKMET' date={new Date(2026, 2, 20,0,0 ,0)} />
        <EventCountdownCard title='SCRIBE' date={new Date(2026, 2, 20,0,0 ,0)} />
        <EventCountdownCard title='SPECIO' date={new Date(2026, 2, 20,0,0 ,0)} />
        <EventCountdownCard title='SCOLL' date={new Date(2026, 2, 20,0,0 ,0)} />
        <EventCountdownCard title='TALASH' date={new Date(2026, 2, 20,0,0 ,0)} />
        <EventCountdownCard title='GNOSIS' date={new Date(2026, 2, 20,0,0 ,0)} />
        <EventCountdownCard title='WALLst' date={new Date(2026, 2, 20,0,0 ,0)} />
    </div>
</div>
  )
}

export default Event