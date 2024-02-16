// import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, RequestTimeoutException } from "@nestjs/common";
// import { JwtService } from "@nestjs/jwt";
// import { Request } from "express";


// @Injectable() 
// export class AuthGuard implements CanActivate {
//     constructor(private jwtService: JwtService) {};

//     async canActivate(context: ExecutionContext): Promise<boolean> {
//         const request = context.switchToHttp().getRequest();
//         const token = this.extractToken(request);
        
//         if(!token) {
//             throw new UnauthorizedException;
//         }

//         try {
//             const decodedToken = this.jwtService.verify(token, {
//                 secret: process.env.JWT_SECRET
//             });
//             request.user = decodedToken;
//         } catch (error) {
//             throw new UnauthorizedException('Invalid token.')
//         }

//         return true;

//     }

//     private extractToken(request: Request) {
//         const [type, token] = request.headers.authorization?.split(' ') ?? [];
//         return type === 'Bearer' ? token : undefined;
//     }
// }