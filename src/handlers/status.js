const status = module.exports;

status.info = async (req, res) => {
  const info = {
    name: 'tyba-ms',
    time: Date.now(),
    status: 'OK',
  };

  return res.send(info);
};
