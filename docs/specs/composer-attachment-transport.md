# Composer attachment transport

## Product rule

Pasted text and uploaded files must send content through attachment upload. They must not depend on `.mesacode` temporary paths or renderer-local paths when content is available.

## State owner

`useComposerAttachments` owns collection and upload state. `serializeChatComposerAttachment` owns conversion to protocol content. `uploadComposerAttachment` owns transport.

## Interface

- Text paste creates an in-memory `File` and serializes as `textContent`.
- Text-like files without a usable remote path serialize as `textContent`.
- Images keep existing base64/path behavior.
- Existing local paths remain valid only for local sessions; remote targets stage or upload content.

## Acceptance scenarios

1. Paste long text; composer shows attachment; send succeeds without creating `.mesacode` files.
2. Upload a small JSON or TXT file; agent receives original content, not preview text.
3. Send same text file to remote workspace; remote agent reads uploaded content.
4. Paste image; existing image behavior remains unchanged.
5. Missing content fails visibly; no silent placeholder attachment.
