import * as React from 'react';

type RequestEmailTemplateProps = {
  donorName: string;
  requesterName: string;
  certificateId: string;
};

export const RequestEmailTemplate: React.FC<Readonly<RequestEmailTemplateProps>> = ({
  donorName,
  requesterName,
  certificateId,
}) => (
  <div>
    <h1>Hello, {donorName}!</h1>
    <p>{requesterName} has requested the donation product you listed.</p>
    <p>You can verify their income certificate using the ID below:</p>
    <img src={certificateId} alt="Income Certificate" style={{ maxWidth: '100%', height: 'auto' }} />
    <p>If you have any questions, please feel free to contact us.</p>
    <p>Thank you for your generosity!</p>
  </div>
);
