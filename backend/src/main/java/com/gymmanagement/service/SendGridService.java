package com.gymmanagement.service;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class SendGridService {

    @Value("${sendgrid.api-key}")
    private String apiKey;

    @Value("${sendgrid.from}")
    private String from;

    public void sendEmail(
            String to,
            String subject,
            String body) throws IOException {

        Email fromEmail = new Email(from);
        Email toEmail = new Email(to);

        Content content = new Content(
                "text/plain",
                body
        );

        Mail mail = new Mail(
                fromEmail,
                subject,
                toEmail,
                content
        );

        SendGrid sendGrid = new SendGrid(apiKey);

        Request request = new Request();

        request.setMethod(Method.POST);
        request.setEndpoint("mail/send");
        request.setBody(mail.build());

        Response response = sendGrid.api(request);

        System.out.println(
                "SendGrid status: " + response.getStatusCode()
        );

        System.out.println(
                "SendGrid response: " + response.getBody()
        );

        if (response.getStatusCode() < 200 ||
                response.getStatusCode() >= 300) {

            throw new RuntimeException(
                    "SendGrid email failed: "
                            + response.getStatusCode()
                            + " "
                            + response.getBody()
            );
        }
    }
}