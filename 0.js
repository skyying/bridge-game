// [72, 73, 74, 69, 70, 75, 72]
// [1, 1, 3, 1, 1, 1, 0]

var reconstructQueue = function(people) {
  let ans = [];
  let sub_hash = {};
  people = people.sort( (a, b) => a[1] - b[1]);
  console.log(people);
  // have a hash store 
  for(let i = 0 ; i < people.length; i++){
    let key = people[i][0];
    console.log("key", key);
    console.log("sub_hash", sub_hash);
    debugger;
    if(sub_hash[key] === undefined){
      sub_hash[key] = [people[i]];
    }else{
      sub_hash[key].push(people[i]);
    }
  }   
  let sorted_height = Object.keys(sub_hash).sort((a, b) => +b - +a);
 
  sorted_height.forEach( (sub_ary_key, i) => {
    
    if(i === 0) {
      ans = sub_hash[sub_ary_key];
    }else{
      sub_hash[sub_ary_key].forEach( group => {
        let target_index = group[1];
        ans.splice(target_index, 1, group);
      });
    }
     
  });


  return ans;
};

console.log(reconstructQueue([[7,0], [4,4], [7,1], [5,0], [6,1], [5,2]]));
