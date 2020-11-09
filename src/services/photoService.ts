export const photoService = {
  getAll() {
    return fetch('https://jsonplaceholder.typicode.com/photos');
  }
};
