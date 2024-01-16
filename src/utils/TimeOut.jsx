// Utility function to introduce a delay using setTimeout
export default function timeOut(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
 