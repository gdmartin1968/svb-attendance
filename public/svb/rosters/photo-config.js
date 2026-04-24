/**
 * PHOTO CONFIGURATION FILE
 * ========================
 * 
 * This file makes it easy to manage photos across all rosters.
 * 
 * HOW TO ADD A NEW STUDENT PHOTO:
 * 1. Add the photo file as firstname.jpg (lowercase) to the appropriate folder:
 *    - Junior Ambassadors: /photos/juniors/firstname.jpg
 *    - Ambassadors: /photos/ambassadors/firstname.jpg  
 *    - Wesley Chapel: /photos/wesleychapel/firstname.jpg
 *    - (Create new folders as needed for new schools)
 * 
 * 2. Add the firstname to the appropriate array below
 * 
 * 3. (Optional) If the photo needs custom positioning, add to photoPositionOverrides
 *    - Use 'center X%' where X is 0-100 (0 = top, 50 = middle, 100 = bottom)
 *    - Default is 'center 20%' which works well for most photos
 * 
 * HOW TO ADD A NEW SCHOOL/ROSTER:
 * 1. Create a new photo folder: /photos/schoolname/
 * 2. Add a new array below: schoolnamePhotos = ['firstname1', 'firstname2', ...]
 * 3. Copy juniors-today.html as a template, update ROSTER_ID and photo folder path
 */

const PHOTO_CONFIG = {
  
  // ========== JUNIOR AMBASSADORS ==========
  juniors: {
    folder: '/photos/juniors/',
    students: [
      'aaliyah', 'abby', 'audrey', 'chloe', 'emin', 'evan', 'gwen', 
      'haven', 'india', 'isabella', 'lincoln', 'lucas', 'maddox', 'teresa', 'william', 'xander'
    ]
  },
  
  // ========== AMBASSADORS ==========
  ambassadors: {
    folder: '/photos/ambassadors/',
    students: [
      // Add ambassador first names here (lowercase)
    ]
  },
  
  // ========== WESLEY CHAPEL ELEMENTARY ==========
  wesleychapel: {
    folder: '/photos/wesleychapel/',
    students: [
      // Add Wesley Chapel first names here (lowercase)
    ]
  },
  
  // ========== ADD NEW SCHOOLS BELOW ==========
  // example_school: {
  //   folder: '/photos/exampleschool/',
  //   students: ['student1', 'student2']
  // },

};

// Photo position overrides for any student across all rosters
// Format: 'firstname': 'center X%'
// Higher % shows more of the BOTTOM of the photo (use when face is low in image)
// Lower % shows more of the TOP of the photo (use when face is high in image)
// 0% = anchor to top, 50% = center, 100% = anchor to bottom
const PHOTO_POSITION_OVERRIDES = {
  'abby': 'center 80%',
  // Add more overrides as needed:
  // 'studentname': 'center 70%',
};

// Default position for all photos
const DEFAULT_PHOTO_POSITION = 'center 20%';

// Helper functions (used by roster HTML files)
function getPhotoUrl(rosterId, displayName) {
  const config = PHOTO_CONFIG[rosterId];
  if (!config) return '';
  
  const firstName = displayName.split(/\s+/)[0].toLowerCase();
  const match = config.students.find(name => name === firstName);
  return match ? `${config.folder}${match}.jpg` : '';
}

function getPhotoPosition(displayName) {
  const firstName = displayName.split(/\s+/)[0].toLowerCase();
  return PHOTO_POSITION_OVERRIDES[firstName] || DEFAULT_PHOTO_POSITION;
}
