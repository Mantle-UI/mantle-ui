import { DocSectionText } from '@/components/doc/common/docsectiontext';

export function CommunicationDoc(props) {
    return (
        <DocSectionText {...props}>
            <p>
                Join the Contributors channel on the{' '}
                <a href="https://discord.gg/BGs6EkpnDv" target="_blank" rel="noopener noreferrer">
                    Mantle UI Discord
                </a>{' '}
                server to connect with MantleUI staff and fellow contributors. In this channel, you can discuss the areas you want to contribute to and receive feedback. This channel is open to everyone who'd like to contribute.
            </p>
        </DocSectionText>
    );
}
