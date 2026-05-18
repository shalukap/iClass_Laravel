import { Helmet } from 'react-helmet-async';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { useFormSpa } from '@/hooks/use-form-spa';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useFormSpa({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/email/verification-notification');
    };

    return (
        <AuthLayout title="Verify email" description="Please verify your email address by clicking on the link we just emailed to you.">
            <Helmet>
                <title>Email verification</title>
            </Helmet>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    A new verification link has been sent to the email address you provided during registration.
                </div>
            )}

            <form onSubmit={submit} className="space-y-6 text-center">
                <Button disabled={processing} variant="secondary" className="w-full">
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                    Resend verification email
                </Button>

                <div className="flex justify-center">
                    <Link to="/logout" className="text-sm text-muted-foreground hover:text-white transition-colors underline underline-offset-4">
                        Log out
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
