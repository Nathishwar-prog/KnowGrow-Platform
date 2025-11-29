import axios from "axios";

// Achievement types and their definitions
export const ACHIEVEMENTS = {
  FIRST_COURSE: {
    type: "first_course",
    name: "First Steps",
    description: "Enrolled in your first course",
    points: 10
  },
  QUIZ_MASTER: {
    type: "quiz_master",
    name: "Quiz Master",
    description: "Completed 5 quizzes",
    points: 25
  },
  STREAK_7: {
    type: "streak_7",
    name: "Week Warrior",
    description: "7-day learning streak",
    points: 50
  },
  STREAK_30: {
    type: "streak_30",
    name: "Month Master",
    description: "30-day learning streak",
    points: 100
  },
  COURSE_COMPLETED: {
    type: "course_completed",
    name: "Course Conqueror",
    description: "Completed your first course",
    points: 75
  }
};

/**
 * Award an achievement to the current user
 * @param {string} achievementType - The type of achievement to award
 * @returns {Promise<boolean>} - Whether the achievement was successfully awarded
 */
export async function awardAchievement(achievementType) {
  try {
    const achievement = ACHIEVEMENTS[achievementType.toUpperCase()];
    
    if (!achievement) {
      console.warn(`Unknown achievement type: ${achievementType}`);
      return false;
    }
    
    const response = await axios.post("/api/achievements", {
      achievementType: achievement.type,
      achievementName: achievement.name,
      description: achievement.description,
      points: achievement.points
    });
    
    console.log(`Achievement awarded: ${achievement.name}`);
    return true;
  } catch (error) {
    // Achievement may already exist, which is fine
    if (error.response?.data?.message === "Achievement already earned") {
      console.log(`Achievement already earned: ${achievementType}`);
      return true;
    }
    
    console.error("Error awarding achievement:", error);
    return false;
  }
}

/**
 * Check if user has earned a specific achievement
 * @param {string} achievementType - The type of achievement to check
 * @returns {Promise<boolean>} - Whether the user has earned the achievement
 */
export async function hasAchievement(achievementType) {
  try {
    const response = await axios.get("/api/achievements");
    const achievements = response.data;
    
    return achievements.some(achievement => 
      achievement.achievementType === achievementType
    );
  } catch (error) {
    console.error("Error checking achievements:", error);
    return false;
  }
}

/**
 * Get user's total achievement points
 * @returns {Promise<number>} - Total points from all achievements
 */
export async function getTotalAchievementPoints() {
  try {
    const response = await axios.get("/api/achievements");
    const achievements = response.data;
    
    return achievements.reduce((total, achievement) => 
      total + (achievement.points || 0), 0
    );
  } catch (error) {
    console.error("Error calculating achievement points:", error);
    return 0;
  }
}