// backend/lib/errors.ts
export class AppError extends Error {
    constructor(
      public statusCode: number,
      message: string,
      public code?: string
    ) {
      super(message);
      this.name = 'AppError';
    }
  }
  
  export class ValidationError extends AppError {
    constructor(message: string) {
      super(400, message, 'VALIDATION_ERROR');
      this.name = 'ValidationError';
    }
  }
  
  export class AuthorizationError extends AppError {
    constructor(message = '認証が必要です') {
      super(401, message, 'AUTHORIZATION_ERROR');
      this.name = 'AuthorizationError';
    }
  }
  
  export class FileUploadError extends AppError {
    constructor(message: string) {
      super(400, message, 'FILE_UPLOAD_ERROR');
      this.name = 'FileUploadError';
    }
  }