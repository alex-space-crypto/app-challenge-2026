import type { Topic } from './types';

export interface HabitSuggestion {
  name: string;
  description: string;
  goalCount: number;
  location?: { name: string; lat: number; lng: number; address: string };
}

const SUGGESTIONS: Record<string, HabitSuggestion[]> = {
  t1: [
    { name: 'Recycle at the Johnston County Convenience Center', description: 'Drop off plastics, glass, and paper for recycling.', goalCount: 12, location: { name: 'Johnston County Convenience Center', lat: 35.5885, lng: -78.5234, address: '680 Landfill Rd, Smithfield, NC' } },
    { name: 'Compost food scraps at home', description: 'Build a compost bin and add scraps daily.', goalCount: 30 },
    { name: 'Pick up litter at Buffalo Creek Greenway', description: 'Bring a bag and pick up trash along the trail.', goalCount: 8, location: { name: 'Buffalo Creek Greenway', lat: 35.7801, lng: -78.3689, address: 'Wendell Falls Pkwy, Wendell, NC' } },
    { name: 'Use reusable grocery bags', description: 'Skip plastic bags on every shopping trip.', goalCount: 20 },
    { name: 'Explore Howell Woods Environmental Learning Center', description: 'Hike managed forest trails, bird watch, and learn about local ecology.', goalCount: 6, location: { name: 'Howell Woods Environmental Learning Center', lat: 35.2414, lng: -78.2239, address: '660 Lectures Loop, Four Oaks, NC' } },
    { name: 'Plant a native tree in your yard', description: 'Plant drought-resistant native species to support local wildlife.', goalCount: 3 },
  ],
  t2: [
    { name: 'Read at the Public Library of Johnston County & Smithfield', description: 'Borrow and finish a book from the main county library on Market Street.', goalCount: 10, location: { name: 'Public Library of Johnston County & Smithfield', lat: 35.5086, lng: -78.3457, address: '305 E Market St, Smithfield, NC' } },
    { name: 'Read at the Selma Public Library', description: 'Borrow and finish a book from the Selma branch.', goalCount: 10, location: { name: 'Selma Public Library', lat: 35.5767, lng: -78.4256, address: '307 W Anderson St, Selma, NC' } },
    { name: 'Visit the Hocutt-Ellington Library in Clayton', description: 'Check out a new book or attend a reading event at Clayton\u2019s historic library.', goalCount: 6, location: { name: 'Hocutt-Ellington Memorial Library', lat: 35.6476, lng: -78.4564, address: '100 S Church St, Clayton, NC' } },
    { name: 'Read at the Benson Library', description: 'Borrow a book from the Benson branch of the county library system.', goalCount: 8, location: { name: 'Benson Library', lat: 35.5103, lng: -78.5392, address: '1006 E Main St, Benson, NC' } },
    { name: 'Read at the James Bryan Creech Library in Four Oaks', description: 'Visit the Four Oaks community library and check out a book.', goalCount: 6, location: { name: 'James Bryan Creech Public Library', lat: 35.4495, lng: -78.4233, address: '206 W Hatcher St, Four Oaks, NC' } },
    { name: 'Read at the Kenly Library', description: 'Borrow a new book from the Kenly branch.', goalCount: 8, location: { name: 'Kenly Library', lat: 35.5959, lng: -78.1226, address: '305 N Railroad St, Kenly, NC' } },
    { name: 'Read 20 minutes before bed', description: 'Wind down with a book every night.', goalCount: 30 },
    { name: 'Read to a younger sibling', description: 'Spend 15 minutes reading aloud to a sibling.', goalCount: 20 },
  ],
  t3: [
    { name: 'Take out the trash and recycling', description: 'Roll bins to the curb every pickup day.', goalCount: 24 },
    { name: 'Load the dishwasher after dinner', description: 'Rinse and load dishes every evening.', goalCount: 30 },
    { name: 'Clean your bedroom', description: 'Tidy up, make the bed, and vacuum weekly.', goalCount: 12 },
    { name: 'Help with yard work', description: 'Mow, rake leaves, or weed the garden.', goalCount: 10 },
    { name: 'Fold and put away laundry', description: 'Fold clothes and put them away after each wash.', goalCount: 20 },
    { name: 'Help at the Smithfield Farmers Market', description: 'Help set up or break down stalls on market days in downtown Smithfield.', goalCount: 8, location: { name: 'Smithfield Farmers Market', lat: 35.5086, lng: -78.3457, address: '305 E Market St, Smithfield, NC' } },
  ],
  t4: [
    { name: 'Walk the Neuse River Greenway', description: 'Walk, run, or bike this scenic 33-mile trail along the Neuse River.', goalCount: 10, location: { name: 'Neuse River Greenway Trailhead', lat: 35.7848, lng: -78.6805, address: '14254 Riverwood Dr, Raleigh, NC' } },
    { name: 'Walk the Clayton River Walk', description: 'Stroll the boardwalk along the Neuse in downtown Clayton.', goalCount: 5, location: { name: 'Clayton River Walk', lat: 35.6476, lng: -78.4564, address: '2nd St & Main St, Clayton, NC' } },
    { name: 'Hike at Raven Rock State Park', description: 'Hike the Raven Rock Loop and enjoy views of the Cape Fear River.', goalCount: 4, location: { name: 'Raven Rock State Park', lat: 35.4652, lng: -78.9473, address: '3009 Raven Rock Rd, Lillington, NC' } },
    { name: 'Walk 10,000 steps a day', description: 'Track your steps and hit 10K daily.', goalCount: 30 },
    { name: 'Bike the Buffalo Creek Greenway', description: 'Ride the greenway trail from Wendell Falls outward.', goalCount: 8, location: { name: 'Buffalo Creek Greenway', lat: 35.7801, lng: -78.3689, address: 'Wendell Falls Pkwy, Wendell, NC' } },
    { name: 'Hike Howell Woods trails in Four Oaks', description: 'Explore over 25 miles of trails through managed forest and wetlands.', goalCount: 6, location: { name: 'Howell Woods Environmental Learning Center', lat: 35.2414, lng: -78.2239, address: '660 Lectures Loop, Four Oaks, NC' } },
    { name: 'Walk Sam\'s Branch Greenway in Clayton', description: 'Enjoy this paved trail through woods and along the creek in Clayton.', goalCount: 8, location: { name: "Sam's Branch Greenway", lat: 35.6532, lng: -78.4781, address: 'Pollen Street, Clayton, NC' } },
    { name: 'Play disc golf at East Clayton Community Park', description: 'Throw a round at the disc golf course in East Clayton.', goalCount: 8, location: { name: 'East Clayton Community Park', lat: 35.6700, lng: -78.4000, address: '1358 Amelia Church Rd, Clayton, NC' } },
    { name: 'Walk the Mountains to Sea Trail segment', description: 'Hike a portion of the MST that passes through Johnston County.', goalCount: 5, location: { name: 'Mountains to Sea Trail - Johnston County', lat: 35.6476, lng: -78.4564, address: 'Clayton, NC' } },
  ],
  t5: [
    { name: 'Drink 8 glasses of water a day', description: 'Stay hydrated throughout the day.', goalCount: 30 },
    { name: 'Carry a reusable water bottle', description: 'Bring your bottle everywhere you go.', goalCount: 21 },
    { name: 'Drink water before every meal', description: 'Have a glass of water before breakfast, lunch, and dinner.', goalCount: 30 },
    { name: 'Track your daily water intake', description: 'Log every glass to build the habit.', goalCount: 14 },
    { name: 'Replace soda with water for a week', description: 'Choose water instead of sugary drinks.', goalCount: 7 },
  ],
  t6: [
    { name: 'Volunteer at the Clayton Community Center', description: 'Help out at community events and programs on Amelia Church Rd.', goalCount: 5, location: { name: 'Clayton Community Center', lat: 35.6509, lng: -78.4602, address: '715 Amelia Church Rd, Clayton, NC' } },
    { name: 'Volunteer with Community & Senior Services of Johnston County', description: 'Deliver meals to seniors in Kenly and Smithfield. Call 919-934-6066 to sign up.', goalCount: 8, location: { name: 'Community & Senior Services of Johnston County', lat: 35.5086, lng: -78.3457, address: '815 N 3rd St, Smithfield, NC' } },
    { name: 'Volunteer at the Saint Ann Food Pantry', description: 'Help serve the hungry of Johnston County. Open Tuesday\u2013Friday mornings.', goalCount: 6, location: { name: 'Saint Ann Catholic Church Food Pantry', lat: 35.5086, lng: -78.3457, address: '909 E Lee St, Smithfield, NC' } },
    { name: 'Help a neighbor with groceries', description: 'Offer to pick up groceries for someone in need.', goalCount: 10 },
    { name: 'Participate in a neighborhood cleanup', description: 'Join a local cleanup event around Johnston County.', goalCount: 4 },
    { name: 'Donate canned food to a local food pantry', description: 'Collect and drop off non-perishables to FeedNC or a county pantry.', goalCount: 6, location: { name: 'FeedNC / Smithfield Food Pantry', lat: 35.5086, lng: -78.3457, address: '909 E Lee St, Smithfield, NC' } },
    { name: 'Visit the Johnston County Senior Center', description: 'Spend time talking with seniors and helping with activities.', goalCount: 8, location: { name: 'Community & Senior Services of Johnston County', lat: 35.5086, lng: -78.3457, address: '815 N 3rd St, Smithfield, NC' } },
    { name: 'Volunteer at the Ava Gardner Museum', description: 'Help preserve Johnston County\u2019s cultural heritage in downtown Smithfield.', goalCount: 5, location: { name: 'Ava Gardner Museum', lat: 35.5086, lng: -78.3457, address: '325 E Market St, Smithfield, NC' } },
    { name: 'Help at the Johnston County Animal Shelter', description: 'Walk dogs, socialize cats, or help with adoptions.', goalCount: 6, location: { name: 'Johnston County Animal Shelter', lat: 35.5885, lng: -78.5234, address: '13878 NC-210, Smithfield, NC' } },
  ],
};

export function getSuggestions(topic: Topic | null): HabitSuggestion[] {
  if (!topic) return [];
  if (SUGGESTIONS[topic.id]) return SUGGESTIONS[topic.id];
  return generateCustomSuggestions(topic.name);
}

function generateCustomSuggestions(topicName: string): HabitSuggestion[] {
  const name = topicName.trim();
  return [
    { name: `Do ${name} daily`, description: `Build a daily ${name.toLowerCase()} routine.`, goalCount: 30 },
    { name: `Do ${name} 3 times a week`, description: `Practice ${name.toLowerCase()} regularly.`, goalCount: 12 },
    { name: `Try ${name} with a friend`, description: `Invite someone to join you in ${name.toLowerCase()}.`, goalCount: 5 },
    { name: `Track your ${name} progress`, description: `Log each time you do ${name.toLowerCase()}.`, goalCount: 20 },
    { name: `Learn more about ${name}`, description: `Read or watch something about ${name.toLowerCase()} each week.`, goalCount: 8 },
  ];
}
