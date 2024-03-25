import { Request, Response, NextFunction } from "express";

/*
  Catch Errors Handler

  With async/await, you need some way to catch errors
  Instead of using try{} catch(e) {} in each controller, we wrap the function in
  catchErrors(), catch any errors they throw, and pass it along to our express middleware with next()
*/

export const catchErrors = <T extends (...args: any[]) => Promise<any>>(
  fn: T
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resp = await fn(req, res, next);
      return resp;
    } catch (err) {
      return next(err);
    }
  };
};

/*
  Not Found Error Handler

  If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display
*/
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  // todo? maybe add 404 page html
  // res.sendfile(path.join(__dirname, 'public', '404.html'))

  res.status(404).json({
    success: false,
    message: "API url doesn't exist. ",
  });
};

/*
  Development Error Handler

  In development we show good error messages so if we hit a syntax error or any other previously un-handled error, we can show good info on what happened
*/
// export const developmentErrors = (
//   err: Error,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   err.stack = err.stack || "";
//   const errorDetails = {
//     message: err.message,
//     status: err.status,
//     stackHighlighted: err.stack.replace(
//       /[a-z_-\d]+.js:\d+:\d+/gi,
//       "<mark>$&</mark>"
//     ),
//   };

//   res.status(500).json({
//     success: false,
//     message: "Oops ! Error in Server",
//   });
// };

/*
  Production Error Handler

  No stacktraces are leaked to admin
*/
export const productionErrors = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500).json({
    success: false,
    message: "Oops ! Error in Server",
  });
};
