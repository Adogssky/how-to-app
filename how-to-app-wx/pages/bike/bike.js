Page({
  data: {
    chosen: false,
    type: '',
    title: '',
    desc: '',
    parts: []
  },

  chooseBike(e) {
    const type = e.currentTarget.dataset.type;
    const data = this.getBikeData(type);
    this.setData({ chosen: true, type, ...data });
  },

  getBikeData(type) {
    const road = {
      title: 'Road bike',
      desc: 'Light, fast and built for paved surfaces. Great for long distances and speed.',
      parts: [
        { name: 'Frame', desc: 'Lightweight aluminum or carbon frame with aggressive geometry.' },
        { name: 'Wheels', desc: '700c narrow tires with high pressure for low rolling resistance.' },
        { name: 'Drivetrain', desc: '2x chainring with wide gear range for flats and climbs.' },
        { name: 'Brakes', desc: 'Rim or disc brakes for reliable stopping power.' }
      ]
    };
    const mtb = {
      title: 'Mountain bike',
      desc: 'Sturdy, with suspension and wide tires for off-road trails.',
      parts: [
        { name: 'Frame', desc: 'Strong frame with relaxed geometry for control on rough terrain.' },
        { name: 'Wheels', desc: '27.5" or 29" wide tires with knobby tread for grip.' },
        { name: 'Suspension', desc: 'Front suspension fork, often with rear suspension on full-suspension bikes.' },
        { name: 'Brakes', desc: 'Hydraulic disc brakes for consistent power in mud and dirt.' }
      ]
    };
    return type === 'road' ? road : mtb;
  },

  goBack() {
    if (this.data.chosen) {
      this.setData({ chosen: false });
    } else {
      wx.navigateBack();
    }
  }
});
