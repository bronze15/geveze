
export var Fake = {
  bool: function(args) {
    /**
     * http://jsfiddle.net/Ronny/Ud5vT/
     */

    return Math.random() < .5; // Readable, succint
  },

  date: function(args) {
    /**
     *
     * http://stackoverflow.com/a/9035732/1766716
     * */
    return new Date(args.start.getTime() + Math.random() * (args.end.getTime() - args.start.getTime()));
  },

  float: function(args) {
    return args.min + Math.random() * (args.max - args.min);
  },

  int: function(args) {
    /*
     * USAGE
     * Fake.({max:10, min:3});
     *
     */
    return Fake.float(args) | 0;
  },
  select: function(list) {
    /*
     * USAGE
     * Fake.select(list);
     *
     */
    let index = Fake.int({
      min: 0,
      max: list.length
    });
    return list[index];
  }
};
