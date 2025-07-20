// app/api/get-verification-code/[username]/route.ts

import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User'; // Adjust the path according to your user model
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { username: string } }
) {
    await dbConnect();

    const { username } = params;

    try {
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

        // Check if verification code exists and is not expired
        if (!user.verifyCode) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'No verification code found. Please request a new one.',
                },
                { status: 404 }
            );
        }

        // Check if verification code is expired
        if (user.verifyCodeExpiry && new Date() > user.verifyCodeExpiry) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Verification code has expired. Please request a new one.',
                },
                { status: 400 }
            );
        }

        // Return the verification code (only for development/testing purposes)
        return NextResponse.json(
            {
                success: true,
                message: 'Verification code retrieved successfully',
                code: user.verifyCode,
                expiresAt: user.verifyCodeExpiry,
            },
            { status: 200 }
        );

    } catch (error) {
        // console.error('Error retrieving verification code:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Error retrieving verification code',
            },
            { status: 500 }
        );
    }
}