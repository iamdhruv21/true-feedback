// app/api/regenerate-verification-code/route.ts

import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User'; // Adjust the path according to your user model
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    await dbConnect();

    try {
        const { username } = await request.json();

        if (!username) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Username is required',
                },
                { status: 400 }
            );
        }

        // Find the user by username
        const user = await UserModel.findOne({ username });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User not found',
                },
                { status: 404 }
            );
        }

        // Check if user is already verified
        if (user.isVerified) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User is already verified',
                },
                { status: 400 }
            );
        }

        // Generate new verification code
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1); // Code expires in 1 hour

        // Update user with new verification code
        user.verifyCode = verifyCode;
        user.verifyCodeExpiry = expiryDate;
        await user.save();

        return NextResponse.json(
            {
                success: true,
                message: 'New verification code generated successfully',
                code: verifyCode, // Only return for development/testing
                expiresAt: expiryDate,
            },
            { status: 200 }
        );

    } catch (error) {
        // console.error('Error regenerating verification code:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Error generating new verification code',
            },
            { status: 500 }
        );
    }
}