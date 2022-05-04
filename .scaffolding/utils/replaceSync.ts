import {
  readFileSync,
  writeFileSync,
} from 'fs'



export const replaceSync = ( params: {
  search: string | RegExp;
  replace: string;
  filepath: string;
  condition?: Function;
}) => {

  const {
    filepath, replace, search, condition,
  } = params;

  const contents = readFileSync( filepath, 'utf8' );

  if ( condition && !condition( contents ) )
  {
    return;
  }

  const newContents = contents.replace( search, replace );

  writeFileSync( filepath, newContents );

};
