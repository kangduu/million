function isEmptyObject(object: any) {
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

export { isEmptyObject };
