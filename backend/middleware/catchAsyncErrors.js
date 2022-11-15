module.exports = (theFunc) => (req, res, next) => {
  //theFunc e ekta  async function call hobe  pore se khane error hoile resolve error dibe & catch to chiloi age error hisebe 
  Promise.resolve(theFunc(req, res, next)).catch(next);
};