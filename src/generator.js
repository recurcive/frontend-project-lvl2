import _ from 'lodash';

export default (object1, object2) => {
  const getSortedKeys = (json1, json2) => _.sortBy(_.union(_.keys(json1), _.keys(json2)));

  const iter = (keys, innerObject1, innerObject2) => keys.map((key) => {
    if (_.has(innerObject1, key) && _.has(innerObject2, key)) {
      if (innerObject1[key] === innerObject2[key]) {
        return {
          type: 'equal',
          key,
          value: innerObject1[key],
        };
      }
      if (_.isObject(innerObject1[key]) && _.isObject(innerObject2[key])) {
        return {
          type: 'nested',
          key,
          children: iter(
            getSortedKeys(innerObject1[key], innerObject2[key]),
            innerObject1[key],
            innerObject2[key],
          ),
        };
      }
      return {
        type: 'updated',
        key,
        valueOld: innerObject1[key],
        valueNew: innerObject2[key],
      };
    }
    if (_.has(innerObject1, key) && !_.has(innerObject2, key)) {
      return {
        type: 'deleted',
        key,
        value: innerObject1[key],
      };
    }
    return {
      type: 'added',
      key,
      value: innerObject2[key],
    };
  });

  return iter(getSortedKeys(object1, object2), object1, object2);
};
