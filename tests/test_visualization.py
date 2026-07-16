import unittest

from transitshield_vision.schemas import TrackObservation, ZoneConfig
from transitshield_vision.visualization import annotate_frame


class VisualizationTests(unittest.TestCase):
    def test_annotation_draws_zone_track_footpoint_and_event_label(self):
        class Frame:
            def copy(self):
                return self

        class CV2:
            FONT_HERSHEY_SIMPLEX = 0
            LINE_AA = 0
            calls = []

            @classmethod
            def polylines(cls, *args, **kwargs):
                cls.calls.append("zone")

            @classmethod
            def rectangle(cls, *args, **kwargs):
                cls.calls.append("box")

            @classmethod
            def circle(cls, *args, **kwargs):
                cls.calls.append("footpoint")

            @classmethod
            def putText(cls, *args, **kwargs):
                cls.calls.append("text")

        zone = ZoneConfig("TRACK", "CAM", "track_area", ((0, 0), (10, 0), (10, 10), (0, 10)))
        track = TrackObservation(0, 0, 1, 0.9, (1, 1, 5, 9), (3, 9), 4, 8)
        annotate_frame(Frame(), [zone], [track], ["person_running_on_track"], cv2_module=CV2)
        self.assertIn("zone", CV2.calls)
        self.assertIn("box", CV2.calls)
        self.assertIn("footpoint", CV2.calls)
        self.assertGreaterEqual(CV2.calls.count("text"), 3)


if __name__ == "__main__":
    unittest.main()
