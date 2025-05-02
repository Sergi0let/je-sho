export const saveReview = async (data: {
  name: string;
  comment: string;
  raiting: string;
}) => {
  try {
    console.log(data);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false };
  }
};
