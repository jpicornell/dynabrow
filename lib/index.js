import Dynamo from './dynamo';
import model from './model';

export default (config) => {
  const dynamoAdapter = new Dynamo(config);
  model.defaultAdapter = dynamoAdapter;
  return { Dynamo, model };
};
