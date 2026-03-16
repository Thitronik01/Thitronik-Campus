"use client";

import { RoleGuard } from "@/components/auth/role-guard";
import { OrderQuiz } from "@/components/tools/order-quiz";

export default function OrderQuizPage() {
    return (
        <RoleGuard requiredRole="user">
            <div className="bg-[#F0F0F0] min-h-screen">
                <div className="container mx-auto py-8">
                    <OrderQuiz />
                </div>
            </div>
        </RoleGuard>
    );
}
