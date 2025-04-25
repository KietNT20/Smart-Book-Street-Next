type VideoEmbedProps = {
  url: string;
};

const VideoEmbed = ({ url }: VideoEmbedProps) => {
  const getEmbedUrl = (url: string) => {
    // YouTube
    const ytRegex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const ytMatch = url.match(ytRegex);
    if (ytMatch) {
      return `https://www.youtube.com/embed/${ytMatch[1]}`;
    }

    // Vimeo
    const vimeoRegex =
      /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|)(\d+)(?:\/|\?|$)|player\.vimeo\.com\/video\/(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
      const vimeoId = vimeoMatch[1] || vimeoMatch[2];
      return `https://player.vimeo.com/video/${vimeoId}`;
    }

    // Facebook
    if (url.includes('facebook.com') && url.includes('video')) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0`;
    }

    return '';
  };

  const embedUrl = getEmbedUrl(url);

  if (!embedUrl)
    return <div className='text-red-500'>URL video không hỗ trợ</div>;

  return (
    <div className='aspect-video w-full overflow-hidden rounded-md'>
      <iframe
        src={embedUrl}
        frameBorder='0'
        allowFullScreen
        className='h-full w-full'
        title='Embedded video'
      />
    </div>
  );
};

export default VideoEmbed;
