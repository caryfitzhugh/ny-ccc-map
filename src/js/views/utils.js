var ViewUtils = {
  json: (o) => {
    var cache = [];
    let json = JSON.stringify(o, function(key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    });
    cache = null; // Enable garbage collection
    return json;
  },
  console: (o) => {
    window.console.log(o);
  },
  uniq_on_prop: (arr_of_hsh, prop) => {
      return _.uniq(arr_of_hsh, (v) => v[prop])
  },
  to_fixed: (val, prec) => {
    var result = val;
    if (prec) {
       result = val.toFixed(prec);
    }
    // console.log(val, result, prec)
    return result;
  },
  add_sign: (val) => {
    let sign = ' ';
    if (val > 0) {
      sign = '+';
    } else if (val < 0) {
      sign = '-';
    }

    return `<span class='sign'>${sign}</span>${Math.abs(val)}`;
  },

  object_entries_count: (obj) => {
    return Object.keys(obj).length;
  },
  color_range_labels: (metrics_range, colors, precision, signed, inverted) => {
    if (!precision && precision !== 0) {
      precision = 2;
    }
    let labels = [];
    let val_count = _.min([metrics_range.length, colors.length]);

    for (let i = 0; i < val_count; i ++) {
      let label =  metrics_range[i];
      if (label) {
          label = label.toFixed(precision);
      }
      if (label && signed) {
        label = ViewUtils.add_sign(label);
      }
      labels.push({label: label, value: label, color: colors[i]});
    }
    // Now post-process the list
    // Blank out the last one
    labels[labels.length - 1].label = "";

    // If any labels are the same as the previous one, clear those out too.
    for (let i = 1; i < labels.length; i++) {
      if (labels[i].value === labels[i-1].value) {
        labels[i].label = ""
      }
    }

    return labels;
  },
  sort_by: (arry, field) => {
    return _.sortBy(arry, field);
  },
  capitalize: (str) => {
    return _.capitalize(str);
  },
  number_of_keys: (hsh) => {
    return _.keys(hsh).length;
  },
  to_sorted_keys_from_hash(hsh) {
    var vals = _.reduce(hsh, (memo, v, k) => {
          memo.push([k,v])
              return memo;
    }, []);
    return _.map(_.sortBy(vals, (v) => { return v[0]; }),
                 (v) => { return {key: v[0], value: v[1]};});
  },
  to_sorted_values_from_hash(hsh) {
    var vals = _.reduce(hsh, (memo, v, k) => {
          memo.push([k,v])
              return memo;
    }, []);
    return _.map(_.sortBy(vals, (v) => { return v[1]; }),
                 (v) => { return {key: v[0], value: v[1]};});
  },
  to_month_name: function (v) {
    var months =  {
     1: "January",
     2: "February",
     3: "March",
     4: "April",
     5: "May",
     6: "June",
     7: "July",
     8: "August",
     9: "September",
     10:"October",
     11:"November",
     12:"December"};
     return months[parseInt(v,10)];
  },
  shorten_string: function (s, l, reverse){
    var stop_chars = [' ','/', '&'];
    var acceptable_shortness = l * 0.80; // When to start looking for stop characters
    var reverse = typeof(reverse) != "undefined" ? reverse : false;
    var s = reverse ? s.split("").reverse().join("") : s;
    var short_s = "";

    for(var i=0; i < l-1; i++){
        short_s += s[i];
        if(i >= acceptable_shortness && stop_chars.indexOf(s[i]) >= 0){
            break;
        }
    }
    if(reverse){ return short_s.split("").reverse().join(""); }
    return short_s;
  },
  shorten_url: function (url, l){
    var l = typeof(l) != "undefined" ? l : 50;
    var chunk_l = (l/2);
    if (url && url.length > 0) {
      var url = url.replace("http://","").replace("https://","");

      if(url.length <= l){ return url; }

      var start_chunk = ViewUtils.shorten_string(url, chunk_l, false);
      var end_chunk = ViewUtils.shorten_string(url, chunk_l, true);
      return start_chunk + ".." + end_chunk;
    } else {
      return url;
    }
  },
  layer_defaults: function (layer_id) {
    var match = null;
    _.each(available_layers, function (l) {
      if (l.id == layer_id) {
        match = l;
      }
    });
    return match;
  }
};
